export type CourseStatus = 'draft' | 'active' | 'archived' | 'completed';
export type DeliveryMode = 'online' | 'in_person' | 'hybrid';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: number;
  title: string;
  description: string;
  courseCode: string;
  departmentId: number | null;
  program: string | null;
  startDate: Date;
  endDate: Date;
  durationWeeks: number | null;
  status: CourseStatus;
  difficultyLevel: DifficultyLevel | null;
  creditHours: number | null;
  maxEnrollment: number | null;
  currentEnrollment: number;
  learningOutcomes: string | null;
  prerequisites: string | null;
  language: string;
  campus: string | null;
  deliveryMode: DeliveryMode;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

export interface CourseWithDetails extends Course {
  moduleCount: number;
  departmentName: string | null;
  instructorName?: string | null;
  prerequisitesCount?: number;
  isEnrolled?: boolean;
  progressPercentage?: number;
  enrollmentCount?: number;
}

export interface StudentCourseProgress {
  courseId: number;
  enrollmentDate: Date;
  status: string;
  progressPercentage: number;
  completedLessons: number;
  totalLessons: number;
}

export interface CourseCardProps {
  course: CourseWithDetails;
  userRole: 'user' | 'admin' | 'superadmin';
  onEnroll?: (courseId: number) => Promise<void>;
  onEdit?: (courseId: number) => void;
}

export interface CourseGridProps {
  courses: CourseWithDetails[];
  userRole: 'user' | 'admin' | 'superadmin';
  currentPage?: number;
  totalPages?: number;
}
