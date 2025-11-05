// Attendance-related types for the CDIL Education App

export type AttendanceStatus = 'present' | 'absent' | 'excused' | 'late';

export interface StudentAttendance {
  id: number;
  studentId: number;
  lessonId: number;
  courseId: number;
  attendanceStatus: AttendanceStatus;
  markedAt: Date;
  markedBy: number;
  notes?: string | null;
}

export interface AttendanceRecord extends StudentAttendance {
  studentName?: string;
  lessonTitle?: string;
  lessonDate?: Date | null;
  moduleName?: string;
}

export interface AttendanceStats {
  studentId: number;
  courseId: number;
  totalLessons: number;
  presentCount: number;
  absentCount: number;
  excusedCount: number;
  lateCount: number;
  attendanceRate: number; // Percentage
}
