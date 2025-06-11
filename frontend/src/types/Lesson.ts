export interface Lesson {
  _id: string;
  title: string;
  link?: string;
  pdf?: string;
  format: "video" | "pdf";
  order?: number;
  quiz?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
