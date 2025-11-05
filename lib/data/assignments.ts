import { query } from '../db';
import type {
  CourseAssignment,
  AssignmentWithStats,
  AssignmentType,
  AssignmentStatus,
} from '@/app/types/assignments';

/**
 * Get all assignments for a course with submission statistics
 * @param courseId - The ID of the course
 * @param limit - Maximum number of results to return (default: 50)
 * @param offset - Number of results to skip (default: 0)
 * @param includeAll - Include draft and archived assignments (default: false)
 * @returns Array of assignments with submission statistics
 */
export async function getAssignmentsByCourse(
  courseId: number,
  limit: number = 50,
  offset: number = 0,
  includeAll: boolean = false
): Promise<AssignmentWithStats[]> {
  try {
    const sql = `
      SELECT
        a.id,
        a.course_id as "courseId",
        a.title,
        a.description,
        a.type,
        a.due_date as "dueDate",
        a.max_points as "maxPoints",
        a.status,
        a.instructions,
        a.resource_urls as "resourceUrls",
        a.created_by as "createdBy",
        a.created_at as "createdAt",
        a.updated_at as "updatedAt",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'graded' THEN 1 END) as "gradedSubmissions",
        COUNT(CASE WHEN s.status IN ('submitted', 'pending') THEN 1 END) as "pendingSubmissions",
        AVG(CASE WHEN s.status = 'graded' THEN s.grade END) as "averageGrade"
      FROM course_assignments a
      LEFT JOIN student_assignment_submissions s ON a.id = s.assignment_id
      WHERE a.course_id = $1
        ${!includeAll ? "AND a.status = 'published'" : ''}
      GROUP BY a.id
      ORDER BY a.due_date ASC NULLS LAST, a.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query<any>(sql, [courseId, limit, offset]);

    return result.rows.map((row) => ({
      id: row.id,
      courseId: row.courseId,
      title: row.title,
      description: row.description,
      type: row.type as AssignmentType,
      dueDate: row.dueDate ? new Date(row.dueDate) : null,
      maxPoints: row.maxPoints ? Number(row.maxPoints) : null,
      status: row.status as AssignmentStatus,
      instructions: row.instructions,
      resourceUrls: row.resourceUrls,
      createdBy: row.createdBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      totalSubmissions: Number(row.totalSubmissions) || 0,
      gradedSubmissions: Number(row.gradedSubmissions) || 0,
      pendingSubmissions: Number(row.pendingSubmissions) || 0,
      averageGrade: row.averageGrade ? Number(row.averageGrade) : null,
    }));
  } catch (error) {
    console.error('Error in getAssignmentsByCourse:', error);
    throw error;
  }
}

/**
 * Get a single assignment by ID
 * @param assignmentId - The ID of the assignment
 * @returns Assignment details or null if not found
 */
export async function getAssignmentById(
  assignmentId: number
): Promise<CourseAssignment | null> {
  try {
    const sql = `
      SELECT
        id,
        course_id as "courseId",
        title,
        description,
        type,
        due_date as "dueDate",
        max_points as "maxPoints",
        status,
        instructions,
        resource_urls as "resourceUrls",
        created_by as "createdBy",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM course_assignments
      WHERE id = $1
    `;

    const result = await query<any>(sql, [assignmentId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];

    return {
      id: row.id,
      courseId: row.courseId,
      title: row.title,
      description: row.description,
      type: row.type as AssignmentType,
      dueDate: row.dueDate ? new Date(row.dueDate) : null,
      maxPoints: row.maxPoints ? Number(row.maxPoints) : null,
      status: row.status as AssignmentStatus,
      instructions: row.instructions,
      resourceUrls: row.resourceUrls,
      createdBy: row.createdBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  } catch (error) {
    console.error('Error in getAssignmentById:', error);
    throw error;
  }
}

/**
 * Get all assignments created by an instructor
 * @param instructorId - The ID of the instructor
 * @param courseId - Optional course ID to filter by
 * @returns Array of assignments with submission statistics
 */
export async function getAssignmentsByInstructor(
  instructorId: number,
  courseId?: number
): Promise<AssignmentWithStats[]> {
  try {
    const sql = `
      SELECT
        a.id,
        a.course_id as "courseId",
        a.title,
        a.description,
        a.type,
        a.due_date as "dueDate",
        a.max_points as "maxPoints",
        a.status,
        a.instructions,
        a.resource_urls as "resourceUrls",
        a.created_by as "createdBy",
        a.created_at as "createdAt",
        a.updated_at as "updatedAt",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'graded' THEN 1 END) as "gradedSubmissions",
        COUNT(CASE WHEN s.status IN ('submitted', 'pending') THEN 1 END) as "pendingSubmissions",
        AVG(CASE WHEN s.status = 'graded' THEN s.grade END) as "averageGrade"
      FROM course_assignments a
      LEFT JOIN student_assignment_submissions s ON a.id = s.assignment_id
      INNER JOIN courses c ON a.course_id = c.id
      INNER JOIN course_instructors ci ON c.id = ci.course_id
      INNER JOIN instructors i ON ci.instructor_id = i.id
      WHERE i.user_id = $1
        ${courseId ? 'AND a.course_id = $2' : ''}
      GROUP BY a.id
      ORDER BY a.updated_at DESC
    `;

    const params = courseId ? [instructorId, courseId] : [instructorId];
    const result = await query<any>(sql, params);

    return result.rows.map((row) => ({
      id: row.id,
      courseId: row.courseId,
      title: row.title,
      description: row.description,
      type: row.type as AssignmentType,
      dueDate: row.dueDate ? new Date(row.dueDate) : null,
      maxPoints: row.maxPoints ? Number(row.maxPoints) : null,
      status: row.status as AssignmentStatus,
      instructions: row.instructions,
      resourceUrls: row.resourceUrls,
      createdBy: row.createdBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
      totalSubmissions: Number(row.totalSubmissions) || 0,
      gradedSubmissions: Number(row.gradedSubmissions) || 0,
      pendingSubmissions: Number(row.pendingSubmissions) || 0,
      averageGrade: row.averageGrade ? Number(row.averageGrade) : null,
    }));
  } catch (error) {
    console.error('Error in getAssignmentsByInstructor:', error);
    throw error;
  }
}

/**
 * Get assignments due within the next X days for a course
 * @param courseId - The ID of the course
 * @param daysAhead - Number of days to look ahead (default: 7)
 * @returns Array of upcoming assignments
 */
export async function getUpcomingAssignments(
  courseId: number,
  daysAhead: number = 7
): Promise<CourseAssignment[]> {
  try {
    const sql = `
      SELECT
        id,
        course_id as "courseId",
        title,
        description,
        type,
        due_date as "dueDate",
        max_points as "maxPoints",
        status,
        instructions,
        resource_urls as "resourceUrls",
        created_by as "createdBy",
        created_at as "createdAt",
        updated_at as "updatedAt"
      FROM course_assignments
      WHERE course_id = $1
        AND status = 'published'
        AND due_date IS NOT NULL
        AND due_date BETWEEN NOW() AND NOW() + INTERVAL '1 day' * $2
      ORDER BY due_date ASC
    `;

    const result = await query<any>(sql, [courseId, daysAhead]);

    return result.rows.map((row) => ({
      id: row.id,
      courseId: row.courseId,
      title: row.title,
      description: row.description,
      type: row.type as AssignmentType,
      dueDate: row.dueDate ? new Date(row.dueDate) : null,
      maxPoints: row.maxPoints ? Number(row.maxPoints) : null,
      status: row.status as AssignmentStatus,
      instructions: row.instructions,
      resourceUrls: row.resourceUrls,
      createdBy: row.createdBy,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    console.error('Error in getUpcomingAssignments:', error);
    throw error;
  }
}
