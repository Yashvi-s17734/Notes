export class CreateNoteDto {
  title: string;
  content?: string;
  isPinned?: boolean;
  category?: string;
}
