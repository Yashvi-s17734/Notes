import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtMiddleware } from './common/jwt.middleware';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import {EmailModule} from "../src/email/email.module"

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // ✅ MUST be here
    PrismaModule,
    AuthModule,
    NotesModule,
    EmailModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/signup', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
