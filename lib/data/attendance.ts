import { query } from '../db';
import type {
  StudentAttendance,
  AttendanceRecord,
  AttendanceStats,
  AttendanceStatus
} from '@/app/types/assignments';

/**
 * Get all attendance records for a student in a specific course
 * Returns records ordered by lesson date (newest first)
 */
export async function getStudentCourseAttendance(
  studentId: number,
  courseId: number
): Promise<AttendanceRecord[]> {
  try {
    const sql = `
      SELECT
        sa.id,
        sa.student_id as "studentId",
        sa.lesson_id as "lessonId",
        sa.course_id as "courseId",
        sa.attendance_status as "attendanceStatus",
        sa.marked_at as "markedAt",
        sa.marked_by as "markedBy",
        sa.notes,
        CONCAT(u.first_name, ' ', u.last_name) as "studentName",
        l.title as "lessonTitle",
        l.lesson_date as "lessonDate",
        m.title as "moduleName"
      FROM student_lesson_attendance sa
      JOIN lessons l ON sa.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN users u ON sa.student_id = u.id
      WHERE sa.student_id = $1 AND sa.course_id = $2
      ORDER BY l.lesson_date DESC;
    `;

    const result = await query<any>(sql, [studentId, courseId]);

    return result.rows.map((row) => ({
      id: row.id,
      studentId: Number(row.studentId),
      lessonId: Number(row.lessonId),
      courseId: Number(row.courseId),
      attendanceStatus: row.attendanceStatus as AttendanceStatus,
      markedAt: row.markedAt ? new Date(row.markedAt) : row.markedAt,
      markedBy: Number(row.markedBy),
      notes: row.notes,
      studentName: row.studentName,
      lessonTitle: row.lessonTitle,
      lessonDate: row.lessonDate ? new Date(row.lessonDate) : null,
      moduleName: row.moduleName,
    }));
  } catch (error) {
    console.error('Error in getStudentCourseAttendance:', error);
    throw error;
  }
}

/**
 * Get all student attendance records for a specific lesson
 * Returns records ordered by student name (ascending)
 */
export async function getLessonAttendance(
  lessonId: number
): Promise<AttendanceRecord[]> {
  try {
    const sql = `
      SELECT
        sa.id,
        sa.student_id as "studentId",
        sa.lesson_id as "lessonId",
        sa.course_id as "courseId",
        sa.attendance_status as "attendanceStatus",
        sa.marked_at as "markedAt",
        sa.marked_by as "markedBy",
        sa.notes,
        CONCAT(u.first_name, ' ', u.last_name) as "studentName",
        l.title as "lessonTitle",
        l.lesson_date as "lessonDate"
      FROM student_lesson_attendance sa
      JOIN users u ON sa.student_id = u.id
      JOIN lessons l ON sa.lesson_id = l.id
      WHERE sa.lesson_id = $1
      ORDER BY u.first_name ASC, u.last_name ASC;
    `;

    const result = await query<any>(sql, [lessonId]);

    return result.rows.map((row) => ({
      id: row.id,
      studentId: Number(row.studentId),
      lessonId: Number(row.lessonId),
      courseId: Number(row.courseId),
      attendanceStatus: row.attendanceStatus as AttendanceStatus,
      markedAt: row.markedAt ? new Date(row.markedAt) : row.markedAt,
      markedBy: Number(row.markedBy),
      notes: row.notes,
      studentName: row.studentName,
      lessonTitle: row.lessonTitle,
      lessonDate: row.lessonDate ? new Date(row.lessonDate) : null,
    }));
  } catch (error) {
    console.error('Error in getLessonAttendance:', error);
    throw error;
  }
}

/**
 * Calculate attendance statistics for a student in a course
 * Returns null if student not enrolled or no data available
 */
export async function getAttendanceStats(
  studentId: number,
  courseId: number
): Promise<AttendanceStats | null> {
  try {
    // First, check if student is enrolled
    const enrollmentSql = `
      SELECT id
      FROM course_enrollments
      WHERE student_id = $1 AND course_id = $2 AND status = 'active'
      LIMIT 1;
    `;

    const enrollmentResult = await query<any>(enrollmentSql, [studentId, courseId]);

    if (enrollmentResult.rows.length === 0) {
      return null;
    }

    // Get total lessons count for the course
    const totalLessonsSql = `
      SELECT COUNT(l.id) as total
      FROM lessons l
      JOIN modules m ON l.module_id = m.id
      WHERE m.course_id = $1;
    `;

    const totalLessonsResult = await query<{ total: string }>(totalLessonsSql, [courseId]);
    const totalLessons = Number(totalLessonsResult.rows[0]?.total || 0);

    if (totalLessons === 0) {
      return null;
    }

    // Get attendance counts by status
    const countsSql = `
      SELECT
        COUNT(*) FILTER (WHERE attendance_status = 'present') as "presentCount",
        COUNT(*) FILTER (WHERE attendance_status = 'absent') as "absentCount",
        COUNT(*) FILTER (WHERE attendance_status = 'excused') as "excusedCount",
        COUNT(*) FILTER (WHERE attendance_status = 'late') as "lateCount"
      FROM student_lesson_attendance
      WHERE student_id = $1 AND course_id = $2;
    `;

    const countsResult = await query<any>(countsSql, [studentId, courseId]);
    const counts = countsResult.rows[0];

    const presentCount = Number(counts?.presentCount || 0);
    const absentCount = Number(counts?.absentCount || 0);
    const excusedCount = Number(counts?.excusedCount || 0);
    const lateCount = Number(counts?.lateCount || 0);

    // Calculate attendance rate (present / total lessons * 100)
    const attendanceRate = totalLessons > 0
      ? Number(((presentCount / totalLessons) * 100).toFixed(2))
      : 0;

    return {
      studentId,
      courseId,
      totalLessons,
      presentCount,
      absentCount,
      excusedCount,
      lateCount,
      attendanceRate,
    };
  } catch (error) {
    console.error('Error in getAttendanceStats:', error);
    throw error;
  }
}

/**
 * Get all lessons where student was marked absent
 * Returns records ordered by lesson date (newest first)
 */
export async function getAbsentLessons(
  studentId: number,
  courseId: number
): Promise<AttendanceRecord[]> {
  try {
    const sql = `
      SELECT
        sa.id,
        sa.student_id as "studentId",
        sa.lesson_id as "lessonId",
        sa.course_id as "courseId",
        sa.attendance_status as "attendanceStatus",
        sa.marked_at as "markedAt",
        sa.marked_by as "markedBy",
        sa.notes,
        CONCAT(u.first_name, ' ', u.last_name) as "studentName",
        l.title as "lessonTitle",
        l.lesson_date as "lessonDate",
        m.title as "moduleName"
      FROM student_lesson_attendance sa
      JOIN lessons l ON sa.lesson_id = l.id
      JOIN modules m ON l.module_id = m.id
      JOIN users u ON sa.student_id = u.id
      WHERE sa.student_id = $1
        AND sa.course_id = $2
        AND sa.attendance_status = 'absent'
      ORDER BY l.lesson_date DESC;
    `;

    const result = await query<any>(sql, [studentId, courseId]);

    return result.rows.map((row) => ({
      id: row.id,
      studentId: Number(row.studentId),
      lessonId: Number(row.lessonId),
      courseId: Number(row.courseId),
      attendanceStatus: row.attendanceStatus as AttendanceStatus,
      markedAt: row.markedAt ? new Date(row.markedAt) : row.markedAt,
      markedBy: Number(row.markedBy),
      notes: row.notes,
      studentName: row.studentName,
      lessonTitle: row.lessonTitle,
      lessonDate: row.lessonDate ? new Date(row.lessonDate) : null,
      moduleName: row.moduleName,
    }));
  } catch (error) {
    console.error('Error in getAbsentLessons:', error);
    throw error;
  }
}
