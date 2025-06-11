// types.ts
export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  pdf?: string;
  order: number;
  format: "video" | "pdf";
  link?: string;
  quiz?: Quiz | string;
}

export interface Course {
  _id: string;
  teacher: User;
  title: string;
  description: string;
  category: string;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  thumbnail?: string;
  duration: string;
  lessons: Lesson[];
  quizFinal?: Quiz | string;
  enrolledStudents: string[] | User[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EnhancedContentSection {
  title: string;
  description?: string;
  content: Array<{
    type: "paragraph" | "list";
    text?: string;
    items?: string[];
  }>;
  examples?: Array<{
    name: string;
    description?: string;
  }>;
}

export interface EnhancedContent {
  mainTitle?: string;
  sections: EnhancedContentSection[];
  processedAt?: Date | null;
  processingStatus: "pending" | "processing" | "completed" | "failed";
}

export interface ResourceKeywordLink {
  title: string;
  link: string;
  description?: string;
}

export interface ResourceKeywords {
  title?: string;
  description?: string;
  youtubeLinks: ResourceKeywordLink[];
  courseLinks: ResourceKeywordLink[];
  processedAt?: Date | null;
  processingStatus: "pending" | "processing" | "completed" | "failed";
}

export interface StudentProgress {
  _id: string;
  student: string | User;
  course: string | Course;
  lesson: number;
  completionStatus: "in-progress" | "completed" | "failed";
  enhancedContent?: EnhancedContent | null;
  resourceKeywords?: ResourceKeywords | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseDetailsResponse {
  course: Course;
  studentProgress?: StudentProgress;
}

export interface Question {
  _id?: string;
  questionText: string;
  options: string[];
  correctAnswers: string[];
  difficultyLevel: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  questions: Question[];
  passingScore: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizAttempt {
  _id: string;
  quiz: string;
  student: string;
  answers: (string | string[])[];
  score: number;
  passed: boolean;
  attemptNumber: number;
  createdAt?: string;
  updatedAt?: string;
}

export type UserAnswer = string | string[];
