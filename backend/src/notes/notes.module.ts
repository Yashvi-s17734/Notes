import { Module } from '@nestjs/common';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';

import { PrismaModule } from 'prisma/prisma.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [PrismaModule,EmailModule],
  controllers: [NotesController],
  providers: [NotesService],

})
export class NotesModule {}
