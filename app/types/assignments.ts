// Assignment Types for CDIL Education App

export type AssignmentType =
  | 'essay'
  | 'quiz'
  | 'project'
  | 'discussion'
  | 'file_upload'
  | 'exam';

export type AssignmentStatus = 'published' | 'draft' | 'archived';

export interface CourseAssignment {
  id: number;
  courseId: number;
  title: string;
  description: string | null;
  type: AssignmentType;
  dueDate: Date | null;
  maxPoints: number | null;
  status: AssignmentStatus;
  instructions: string | null;
  resourceUrls: string | null;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentWithStats extends CourseAssignment {
  totalSubmissions: number;
  gradedSubmissions: number;
  pendingSubmissions: number;
  averageGrade: number | null;
}
