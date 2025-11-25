import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import type { JwtPayload } from 'jsonwebtoken';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUser } from '../auth/interfaces/auth-user.interface';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }
    const token = header.split(' ')[1];
    const payload = this.authService.verifyToken(token) as JwtPayload | null;

    if (!payload || !payload.sub) {
      req.user = null;
      return next();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      req.user = null;
      return next();
    }
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    } as AuthUser;

    next();
  }
}
