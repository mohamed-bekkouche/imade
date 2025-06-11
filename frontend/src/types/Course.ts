export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  enrolledStudents?: string[]; // Array of user IDs
  rating?: number;
  thumbnail: string;
  pdfFile?: string; // Added PDF file field
  format: "pdf" | "video";
  teacher: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  modules?: {
    _id: string;
    title: string;
    lessons: {
      _id: string;
      title: string;
      duration: string;
      type: "video" | "pdf" | "quiz";
      fileUrl?: string; // Added for lesson PDFs
    }[];
  }[];
  requirements?: string[];
  learningOutcomes?: string[];
}
