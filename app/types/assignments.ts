// Types for student assignment submissions

export type SubmissionStatus = 'pending' | 'submitted' | 'graded' | 'late' | 'resubmitted';

export interface StudentSubmission {
  id: number;
  assignmentId: number;
  studentId: number;
  courseId: number;
  submissionContent: string | null;
  submittedAt: Date | null;
  status: SubmissionStatus;
  grade: number | null;
  maxPoints: number | null;
  feedback: string | null;
  gradedAt: Date | null;
  gradedBy: number | null;
  markedLate: boolean;
}

export interface SubmissionWithDetails extends StudentSubmission {
  // Additional fields from joins
  assignmentTitle?: string;
  assignmentType?: string;
  courseName?: string;
  studentName?: string;
  studentEmail?: string;
  graderName?: string | null;
}

export interface SubmissionStats {
  assignmentId: number;
  assignmentTitle: string;
  totalSubmissions: number;
  gradedCount: number;
  pendingCount: number;
  averageGrade: number | null;
}
