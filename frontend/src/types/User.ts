export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  gender: 'Homme' | 'Femme';
  firstName: string;
  lastName: string;
  avatar?: string;
  ageGroup?: string;
  educationLevel?: string;
  programmingExperience?: string;
  favoriteProgrammingTopic?: string;
  learningStyle?: string;
  weeklyAvailability?: string;
  preferredCourseDuration?: string;
  learningAutonomy?: string;
  hasCompletedSignupQuiz: boolean;
} 