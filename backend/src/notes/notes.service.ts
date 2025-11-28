import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ShareNoteDto } from './dto/share-note.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import { EmailService } from '../email/email.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async findAll(user: AuthUser, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [notes, total] = await this.prisma.$transaction([
      this.prisma.note.findMany({
        where: { userId: user.id, isArchived: false },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),

      this.prisma.note.count({
        where: { userId: user.id, isArchived: false },
      }),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: notes,
    };
  }

  async create(dto: CreateNoteDto, user: AuthUser) {
    return this.prisma.note.create({
      data: {
        title: dto.title,
        content: dto.content ?? '',
        category: dto.category ?? 'Other',
        isPinned: dto.isPinned ?? false,
        userId: user.id,
      },
    });
  }

  async update(id: string, dto: UpdateNoteDto, user: AuthUser) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, user: AuthUser) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!note) throw new NotFoundException('Note not found');

    await this.prisma.note.delete({ where: { id } });
    return { deleted: true };
  }

  async findArchived(user: AuthUser) {
    return this.prisma.note.findMany({
      where: { userId: user.id, isArchived: true },
    });
  }

  async archiveNote(id: string, user: AuthUser) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.update({
      where: { id },
      data: { isArchived: true },
    });
  }

  async restoreNote(id: string, user: AuthUser) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!note) throw new NotFoundException('Note not found');

    return this.prisma.note.update({
      where: { id },
      data: { isArchived: false },
    });
  }

  async deleteForever(id: string, user: AuthUser) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId: user.id },
    });

    if (!note) throw new NotFoundException('Note not found');

    await this.prisma.note.delete({ where: { id } });
    return { message: 'Note permanently deleted' };
  }

  private async canAccess(
    noteId: string,
    user: AuthUser,
    required: 'view' | 'edit' | 'owner' = 'view',
  ): Promise<boolean> {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) return false;

    if (note.userId === user.id) return true;

    const share = await this.prisma.noteShare.findUnique({
      where: {
        noteId_userId: {
          noteId,
          userId: user.id,
        },
      },
    });

    if (!share) return false;

    if (required === 'edit' && share.permission !== 'edit') return false;
    if (required === 'owner') return false;

    return true;
  }

  async shareNote(noteId: string, dto: ShareNoteDto, user: AuthUser) {
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });

    let targetUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!targetUser) {
      await this.prisma.invitation.create({
        data: {
          email: dto.email,
          noteId: noteId,
        },
      });

      const inviteLink = `${process.env.FRONTEND_URL}/invite?email=${dto.email}&note=${noteId}`;

      await this.emailService.sendInvitationEmail(
        dto.email,
        note!.title,
        user.username,
        inviteLink,
      );

      return { message: 'Invitation sent. User must sign up to access note.' };
    }

    const share = await this.prisma.noteShare.upsert({
      where: {
        noteId_userId: {
          noteId,
          userId: targetUser.id,
        },
      },
      update: { permission: dto.permission },
      create: {
        noteId,
        userId: targetUser.id,
        permission: dto.permission,
      },
    });

    const shareLink = `${process.env.FRONTEND_URL}/shared`;

    await this.emailService.sendShareNotification(
      targetUser.email,
      note!.title,
      user.username,
      dto.permission,
      shareLink,
    );

    return share;
  }

  async getSharedNotes(user: AuthUser) {
    return this.prisma.noteShare.findMany({
      where: { userId: user.id },
      include: {
        note: {
          include: {
            user: { select: { username: true } },
          },
        },
      },
    });
  }
}
