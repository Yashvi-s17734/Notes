import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UnauthorizedException,
  Req,
  Query,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ShareNoteDto } from './dto/share-note.dto';
import { AuthUser } from '../auth/interfaces/auth-user.interface';
import type { Request } from 'express';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  private getUser(req: Request): AuthUser {
    if (!req.user) throw new UnauthorizedException('Invalid or missing token');
    return req.user as AuthUser;
  }

  @Post(':id/share')
  async share(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: ShareNoteDto,
  ) {
    const user = this.getUser(req);
    return this.notesService.shareNote(id, dto, user);
  }

  @Get('shared')
  async getShared(@Req() req: Request) {
    const user = this.getUser(req);
    return this.notesService.getSharedNotes(user);
  }

  @Get()
  async getActive(
    @Req() req: Request,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    const user = this.getUser(req);
    return this.notesService.findAll(user, Number(page), Number(limit));
  }

  @Post()
  async create(@Req() req: Request, @Body() dto: CreateNoteDto) {
    const user = this.getUser(req);
    return this.notesService.create(dto, user);
  }

  @Put(':id')
  async update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() dto: UpdateNoteDto,
  ) {
    const user = this.getUser(req);
    return this.notesService.update(id, dto, user);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: string) {
    const user = this.getUser(req);
    return this.notesService.remove(id, user);
  }

  @Get('archive')
  async getArchived(@Req() req: Request) {
    const user = this.getUser(req);
    return this.notesService.findArchived(user);
  }

  @Post(':id/archive')
  async archive(@Req() req: Request, @Param('id') id: string) {
    const user = this.getUser(req);
    return this.notesService.archiveNote(id, user);
  }

  @Post(':id/restore')
  async restore(@Req() req: Request, @Param('id') id: string) {
    const user = this.getUser(req);
    return this.notesService.restoreNote(id, user);
  }

  @Delete(':id/delete-forever')
  async deleteForever(@Req() req: Request, @Param('id') id: string) {
    const user = this.getUser(req);
    return this.notesService.deleteForever(id, user);
  }
}
