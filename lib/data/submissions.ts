import { query } from '../db';
import type {
  StudentSubmission,
  SubmissionWithDetails,
  SubmissionStatus,
  SubmissionStats,
} from '@/app/types/assignments';

// Transform database row to StudentSubmission
function transformSubmissionRow(row: any): StudentSubmission {
  return {
    id: row.id,
    assignmentId: row.assignmentId,
    studentId: row.studentId,
    courseId: row.courseId,
    submissionContent: row.submissionContent,
    submittedAt: row.submittedAt ? new Date(row.submittedAt) : null,
    status: row.status as SubmissionStatus,
    grade: row.grade ? Number(row.grade) : null,
    maxPoints: row.maxPoints ? Number(row.maxPoints) : null,
    feedback: row.feedback,
    gradedAt: row.gradedAt ? new Date(row.gradedAt) : null,
    gradedBy: row.gradedBy,
    markedLate: row.markedLate,
  };
}

// Transform database row to SubmissionWithDetails
function transformSubmissionWithDetailsRow(row: any): SubmissionWithDetails {
  return {
    ...transformSubmissionRow(row),
    assignmentTitle: row.assignmentTitle,
    assignmentType: row.assignmentType,
    courseName: row.courseName,
    studentName: row.studentName,
    studentEmail: row.studentEmail,
    graderName: row.graderName,
  };
}

/**
 * Get a single submission by ID
 */
export async function getSubmissionById(
  submissionId: number
): Promise<StudentSubmission | null> {
  try {
    const sql = `
      SELECT
        id,
        assignment_id as "assignmentId",
        student_id as "studentId",
        course_id as "courseId",
        submission_content as "submissionContent",
        submitted_at as "submittedAt",
        status,
        grade,
        max_points as "maxPoints",
        feedback,
        graded_at as "gradedAt",
        graded_by as "gradedBy",
        marked_late as "markedLate"
      FROM student_assignment_submissions
      WHERE id = $1
    `;

    const result = await query<any>(sql, [submissionId]);
    return result.rows.length > 0
      ? transformSubmissionRow(result.rows[0])
      : null;
  } catch (error) {
    console.error('Error in getSubmissionById:', error);
    throw error;
  }
}

/**
 * Get all submissions for a student across all courses
 */
export async function getStudentSubmissions(
  studentId: number,
  limit: number = 50,
  offset: number = 0
): Promise<SubmissionWithDetails[]> {
  try {
    const sql = `
      SELECT
        s.id,
        s.assignment_id as "assignmentId",
        s.student_id as "studentId",
        s.course_id as "courseId",
        s.submission_content as "submissionContent",
        s.submitted_at as "submittedAt",
        s.status,
        s.grade,
        s.max_points as "maxPoints",
        s.feedback,
        s.graded_at as "gradedAt",
        s.graded_by as "gradedBy",
        s.marked_late as "markedLate",
        a.title as "assignmentTitle",
        a.type as "assignmentType",
        c.title as "courseName"
      FROM student_assignment_submissions s
      INNER JOIN course_assignments a ON s.assignment_id = a.id
      INNER JOIN courses c ON s.course_id = c.id
      WHERE s.student_id = $1
      ORDER BY s.submitted_at DESC NULLS LAST
      LIMIT $2 OFFSET $3
    `;

    const result = await query<any>(sql, [studentId, limit, offset]);
    return result.rows.map(transformSubmissionWithDetailsRow);
  } catch (error) {
    console.error('Error in getStudentSubmissions:', error);
    throw error;
  }
}

/**
 * Get all student submissions for a specific assignment
 */
export async function getSubmissionsByAssignment(
  assignmentId: number,
  limit: number = 50,
  offset: number = 0
): Promise<SubmissionWithDetails[]> {
  try {
    const sql = `
      SELECT
        s.id,
        s.assignment_id as "assignmentId",
        s.student_id as "studentId",
        s.course_id as "courseId",
        s.submission_content as "submissionContent",
        s.submitted_at as "submittedAt",
        s.status,
        s.grade,
        s.max_points as "maxPoints",
        s.feedback,
        s.graded_at as "gradedAt",
        s.graded_by as "gradedBy",
        s.marked_late as "markedLate",
        u.first_name || ' ' || u.last_name as "studentName",
        u.email as "studentEmail",
        g.first_name || ' ' || g.last_name as "graderName"
      FROM student_assignment_submissions s
      INNER JOIN users u ON s.student_id = u.id
      LEFT JOIN users g ON s.graded_by = g.id
      WHERE s.assignment_id = $1
      ORDER BY s.submitted_at DESC NULLS LAST, u.last_name ASC, u.first_name ASC
      LIMIT $2 OFFSET $3
    `;

    const result = await query<any>(sql, [assignmentId, limit, offset]);
    return result.rows.map(transformSubmissionWithDetailsRow);
  } catch (error) {
    console.error('Error in getSubmissionsByAssignment:', error);
    throw error;
  }
}

/**
 * Get all submissions awaiting grading for instructor's courses
 */
export async function getGradingQueue(
  instructorId: number,
  courseId?: number
): Promise<SubmissionWithDetails[]> {
  try {
    const params: any[] = [instructorId];
    let courseFilter = '';

    if (courseId !== undefined) {
      params.push(courseId);
      courseFilter = 'AND c.id = $2';
    }

    const sql = `
      SELECT
        s.id,
        s.assignment_id as "assignmentId",
        s.student_id as "studentId",
        s.course_id as "courseId",
        s.submission_content as "submissionContent",
        s.submitted_at as "submittedAt",
        s.status,
        s.grade,
        s.max_points as "maxPoints",
        s.feedback,
        s.graded_at as "gradedAt",
        s.graded_by as "gradedBy",
        s.marked_late as "markedLate",
        a.title as "assignmentTitle",
        a.type as "assignmentType",
        u.first_name || ' ' || u.last_name as "studentName",
        u.email as "studentEmail"
      FROM student_assignment_submissions s
      INNER JOIN course_assignments a ON s.assignment_id = a.id
      INNER JOIN courses c ON a.course_id = c.id
      INNER JOIN course_instructors ci ON c.id = ci.course_id
      INNER JOIN users u ON s.student_id = u.id
      WHERE ci.instructor_id = $1
        AND s.status IN ('submitted', 'resubmitted')
        ${courseFilter}
      ORDER BY s.submitted_at ASC
    `;

    const result = await query<any>(sql, params);
    return result.rows.map(transformSubmissionWithDetailsRow);
  } catch (error) {
    console.error('Error in getGradingQueue:', error);
    throw error;
  }
}

/**
 * Get student's grade for a specific assignment
 */
export async function getSubmissionGrade(
  studentId: number,
  assignmentId: number
): Promise<StudentSubmission | null> {
  try {
    const sql = `
      SELECT
        id,
        assignment_id as "assignmentId",
        student_id as "studentId",
        course_id as "courseId",
        submission_content as "submissionContent",
        submitted_at as "submittedAt",
        status,
        grade,
        max_points as "maxPoints",
        feedback,
        graded_at as "gradedAt",
        graded_by as "gradedBy",
        marked_late as "markedLate"
      FROM student_assignment_submissions
      WHERE student_id = $1 AND assignment_id = $2
    `;

    const result = await query<any>(sql, [studentId, assignmentId]);
    return result.rows.length > 0
      ? transformSubmissionRow(result.rows[0])
      : null;
  } catch (error) {
    console.error('Error in getSubmissionGrade:', error);
    throw error;
  }
}

/**
 * Get submission statistics grouped by assignment for a course
 */
export async function getCourseSubmissionStats(
  courseId: number
): Promise<SubmissionStats[]> {
  try {
    const sql = `
      SELECT
        a.id as "assignmentId",
        a.title as "assignmentTitle",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'graded' THEN 1 END) as "gradedCount",
        COUNT(CASE WHEN s.status IN ('submitted', 'pending', 'resubmitted') THEN 1 END) as "pendingCount",
        AVG(CASE WHEN s.status = 'graded' THEN s.grade END) as "averageGrade"
      FROM course_assignments a
      LEFT JOIN student_assignment_submissions s ON a.id = s.assignment_id
      WHERE a.course_id = $1
      GROUP BY a.id, a.title, a.due_date
      ORDER BY a.due_date ASC NULLS LAST
    `;

    const result = await query<any>(sql, [courseId]);
    return result.rows.map((row) => ({
      assignmentId: row.assignmentId,
      assignmentTitle: row.assignmentTitle,
      totalSubmissions: Number(row.totalSubmissions) || 0,
      gradedCount: Number(row.gradedCount) || 0,
      pendingCount: Number(row.pendingCount) || 0,
      averageGrade: row.averageGrade ? Number(row.averageGrade) : null,
    }));
  } catch (error) {
    console.error('Error in getCourseSubmissionStats:', error);
    throw error;
  }
}
