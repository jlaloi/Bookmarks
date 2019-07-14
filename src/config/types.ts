export interface Bookmark {
  id: number;
  url: string;
  author?: string;
  duration?: number;
  createdDate:Date;
  publicationDate?: Date;
  height?: number;
  title?: string;
  thumbnail?: string;
  tags: Array<string>;
  width?: number;
}
