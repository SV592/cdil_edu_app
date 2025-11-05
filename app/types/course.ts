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
  showPagination?: boolean;
}

export type ContentType = 'video' | 'text' | 'interactive' | 'quiz';
export type LessonStatus = 'published' | 'draft';
export type ResourceType = 'pdf' | 'video' | 'link' | 'document' | 'presentation';
export type MaterialScope = 'course' | 'module' | 'lesson';

export interface Material {
  id: number;
  title: string;
  description: string | null;
  resourceType: ResourceType;
  resourceUrl: string;
  format: string;
  source: string | null;
  orderIndex: number;
}

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  content: string | null;
  contentType: ContentType;
  lessonDate: Date | null;
  orderIndex: number;
  status: LessonStatus;
  durationMinutes: number | null;
  learningObjectives: string | null;
  isLive: boolean;
  deliveryMode: DeliveryMode;
  sessionTime: string | null;
  meetingLink: string | null;
  materials: Material[];
}

export interface Module {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  orderIndex: number;
  status: LessonStatus;
  estimatedDurationHours: number | null;
  lessons: Lesson[];
}

export interface CourseDetails extends CourseWithDetails {
  modules: Module[];
  totalLessons: number;
  totalDurationMinutes: number;
}
