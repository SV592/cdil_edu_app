export type AssignmentType = 'essay' | 'quiz' | 'project' | 'discussion' | 'file_upload' | 'exam';
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
  assignmentTitle: string;
  assignmentType: AssignmentType;
  studentName: string;
  studentEmail: string;
  graderName: string | null;
}

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late';

export interface StudentAttendance {
  id: number;
  studentId: number;
  lessonId: number;
  courseId: number;
  attendanceStatus: AttendanceStatus;
  markedAt: Date;
  markedBy: number | null;
  notes: string | null;
}

export interface AttendanceRecord extends StudentAttendance {
  lessonTitle: string;
  lessonDate: Date | null;
  moduleName: string;
  studentName: string;
}

export interface AttendanceStats {
  studentId: number;
  courseId: number;
  totalLessons: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  lateCount: number;
  attendanceRate: number;
}
