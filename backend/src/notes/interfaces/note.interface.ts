export interface Note {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  isPinned?: boolean;
  category?: string;
   username: string;
  isArchived?: boolean;
}
