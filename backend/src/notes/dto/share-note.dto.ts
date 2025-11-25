import { IsEmail, IsEnum } from 'class-validator';

export class ShareNoteDto {
  @IsEmail()
  email: string;

  @IsEnum(['view', 'edit'])
  permission: 'view' | 'edit';
}