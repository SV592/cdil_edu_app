import { query } from '../db';
import type { CourseWithDetails } from '@/app/types/course';

// Transform database
function transformCourseRow(row: any): CourseWithDetails {
  return {
    ...row,
    startDate: row.startDate ? new Date(row.startDate) : row.startDate,
    endDate: row.endDate ? new Date(row.endDate) : row.endDate,
    createdAt: row.createdAt ? new Date(row.createdAt) : row.createdAt,
    updatedAt: row.updatedAt ? new Date(row.updatedAt) : row.updatedAt,
    moduleCount: row.moduleCount ? Number(row.moduleCount) : 0,
    prerequisitesCount: row.prerequisitesCount !== undefined ? Number(row.prerequisitesCount) : undefined,
    progressPercentage: row.progressPercentage ? Number(row.progressPercentage) : undefined,
    enrollmentCount: row.enrollmentCount ? Number(row.enrollmentCount) : undefined,
    creditHours: row.creditHours ? Number(row.creditHours) : row.creditHours,
    maxEnrollment: row.maxEnrollment ? Number(row.maxEnrollment) : row.maxEnrollment,
    currentEnrollment: row.currentEnrollment ? Number(row.currentEnrollment) : row.currentEnrollment,
  };
}

export async function getCoursesForStudent(
  studentId: number,
  page: number = 1,
  limit: number = 9
): Promise<CourseWithDetails[]> {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT
      c.id,
      c.title,
      c.description,
      c.course_code as "courseCode",
      c.department_id as "departmentId",
      c.program,
      c.start_date as "startDate",
      c.end_date as "endDate",
      c.duration_weeks as "durationWeeks",
      c.status,
      c.difficulty_level as "difficultyLevel",
      c.credit_hours as "creditHours",
      c.max_enrollment as "maxEnrollment",
      c.current_enrollment as "currentEnrollment",
      c.learning_outcomes as "learningOutcomes",
      c.prerequisites,
      c.language,
      c.campus,
      c.delivery_mode as "deliveryMode",
      c.location,
      c.created_at as "createdAt",
      c.updated_at as "updatedAt",
      c.created_by as "createdBy",
      COUNT(DISTINCT m.id) as "moduleCount",
      d.name as "departmentName",
      (
        SELECT CONCAT(u.first_name, ' ', u.last_name)
        FROM course_instructors ci
        JOIN instructors i ON ci.instructor_id = i.id
        JOIN users u ON i.user_id = u.id
        WHERE ci.course_id = c.id AND ci.role = 'primary'
        LIMIT 1
      ) as "instructorName",
      CASE
        WHEN c.prerequisites IS NULL OR c.prerequisites = 'None' THEN 0
        ELSE array_length(string_to_array(c.prerequisites, ','), 1)
      END as "prerequisitesCount",
      CASE
        WHEN ce.id IS NOT NULL THEN true
        ELSE false
      END as "isEnrolled",
      COALESCE(
        ROUND(
          (SELECT COUNT(*)::numeric FROM student_lesson_attendance sla
           JOIN lessons l ON sla.lesson_id = l.id
           JOIN modules m2 ON l.module_id = m2.id
           WHERE sla.student_id = $1
           AND m2.course_id = c.id
           AND sla.attendance_status = 'present'
          ) / NULLIF(
            (SELECT COUNT(*)::numeric FROM lessons l2
             JOIN modules m3 ON l2.module_id = m3.id
             WHERE m3.course_id = c.id
            ), 0
          ) * 100, 2
        ), 0
      ) as "progressPercentage"
    FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN modules m ON c.id = m.course_id
    LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.student_id = $1 AND ce.status = 'active'
    GROUP BY c.id, d.name, ce.id
    ORDER BY c.created_at DESC
    LIMIT $2 OFFSET $3;
  `;

  const result = await query<CourseWithDetails>(sql, [studentId, limit, offset]);
  return result.rows.map(transformCourseRow);
}

export async function getCoursesForInstructor(
  instructorId: number,
  isSuperAdmin: boolean = false,
  page: number = 1,
  limit: number = 9
): Promise<CourseWithDetails[]> {
  const offset = (page - 1) * limit;

  const sql = `
    SELECT
      c.id,
      c.title,
      c.description,
      c.course_code as "courseCode",
      c.department_id as "departmentId",
      c.program,
      c.start_date as "startDate",
      c.end_date as "endDate",
      c.duration_weeks as "durationWeeks",
      c.status,
      c.difficulty_level as "difficultyLevel",
      c.credit_hours as "creditHours",
      c.max_enrollment as "maxEnrollment",
      c.current_enrollment as "currentEnrollment",
      c.learning_outcomes as "learningOutcomes",
      c.prerequisites,
      c.language,
      c.campus,
      c.delivery_mode as "deliveryMode",
      c.location,
      c.created_at as "createdAt",
      c.updated_at as "updatedAt",
      c.created_by as "createdBy",
      COUNT(DISTINCT m.id) as "moduleCount",
      COUNT(DISTINCT ce.id) FILTER (WHERE ce.status = 'active') as "enrollmentCount",
      d.name as "departmentName",
      (
        SELECT CONCAT(u.first_name, ' ', u.last_name)
        FROM course_instructors ci
        JOIN instructors i ON ci.instructor_id = i.id
        JOIN users u ON i.user_id = u.id
        WHERE ci.course_id = c.id AND ci.role = 'primary'
        LIMIT 1
      ) as "instructorName",
      CASE
        WHEN c.prerequisites IS NULL OR c.prerequisites = 'None' THEN 0
        ELSE array_length(string_to_array(c.prerequisites, ','), 1)
      END as "prerequisitesCount"
    FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN modules m ON c.id = m.course_id
    LEFT JOIN course_enrollments ce ON c.id = ce.course_id
    WHERE c.created_by = $1 OR $2 = true
    GROUP BY c.id, d.name
    ORDER BY c.created_at DESC
    LIMIT $3 OFFSET $4;
  `;

  const result = await query<CourseWithDetails>(sql, [
    instructorId,
    isSuperAdmin,
    limit,
    offset,
  ]);
  return result.rows.map(transformCourseRow);
}

export async function getCourseById(
  courseId: number,
  studentId?: number
): Promise<CourseWithDetails | null> {
  const sql = `
    SELECT
      c.id,
      c.title,
      c.description,
      c.course_code as "courseCode",
      c.department_id as "departmentId",
      c.program,
      c.start_date as "startDate",
      c.end_date as "endDate",
      c.duration_weeks as "durationWeeks",
      c.status,
      c.difficulty_level as "difficultyLevel",
      c.credit_hours as "creditHours",
      c.max_enrollment as "maxEnrollment",
      c.current_enrollment as "currentEnrollment",
      c.learning_outcomes as "learningOutcomes",
      c.prerequisites,
      c.language,
      c.campus,
      c.delivery_mode as "deliveryMode",
      c.location,
      c.created_at as "createdAt",
      c.updated_at as "updatedAt",
      c.created_by as "createdBy",
      COUNT(DISTINCT m.id) as "moduleCount",
      d.name as "departmentName",
      (
        SELECT CONCAT(u.first_name, ' ', u.last_name)
        FROM course_instructors ci
        JOIN instructors i ON ci.instructor_id = i.id
        JOIN users u ON i.user_id = u.id
        WHERE ci.course_id = c.id AND ci.role = 'primary'
        LIMIT 1
      ) as "instructorName",
      CASE
        WHEN c.prerequisites IS NULL OR c.prerequisites = 'None' THEN 0
        ELSE array_length(string_to_array(c.prerequisites, ','), 1)
      END as "prerequisitesCount",
      ${
        studentId
          ? `
      CASE
        WHEN ce.id IS NOT NULL THEN true
        ELSE false
      END as "isEnrolled",
      COALESCE(
        ROUND(
          (SELECT COUNT(*)::numeric FROM student_lesson_attendance sla
           JOIN lessons l ON sla.lesson_id = l.id
           JOIN modules m2 ON l.module_id = m2.id
           WHERE sla.student_id = $2
           AND m2.course_id = c.id
           AND sla.attendance_status = 'present'
          ) / NULLIF(
            (SELECT COUNT(*)::numeric FROM lessons l2
             JOIN modules m3 ON l2.module_id = m3.id
             WHERE m3.course_id = c.id
            ), 0
          ) * 100, 2
        ), 0
      ) as "progressPercentage",
      `
          : ''
      }
      COUNT(DISTINCT ce2.id) FILTER (WHERE ce2.status = 'active') as "enrollmentCount"
    FROM courses c
    LEFT JOIN departments d ON c.department_id = d.id
    LEFT JOIN modules m ON c.id = m.course_id
    ${studentId ? 'LEFT JOIN course_enrollments ce ON c.id = ce.course_id AND ce.student_id = $2 AND ce.status = \'active\'' : ''}
    LEFT JOIN course_enrollments ce2 ON c.id = ce2.course_id
    WHERE c.id = $1
    GROUP BY c.id, d.name${studentId ? ', ce.id' : ''};
  `;

  const params = studentId ? [courseId, studentId] : [courseId];
  const result = await query<CourseWithDetails>(sql, params);

  return result.rows.length > 0 ? transformCourseRow(result.rows[0]) : null;
}

export async function getCoursesCountForStudent(
  studentId: number
): Promise<number> {
  const sql = `
    SELECT COUNT(DISTINCT c.id) as total
    FROM courses c
    WHERE c.status = 'active';
  `;

  const result = await query<{ total: string }>(sql, []);
  return Number(result.rows[0]?.total || 0);
}

export async function getCoursesCountForInstructor(
  instructorId: number,
  isSuperAdmin: boolean = false
): Promise<number> {
  const sql = `
    SELECT COUNT(DISTINCT c.id) as total
    FROM courses c
    WHERE c.created_by = $1 OR $2 = true;
  `;

  const result = await query<{ total: string }>(sql, [instructorId, isSuperAdmin]);
  return Number(result.rows[0]?.total || 0);
}

export async function enrollStudent(
  studentId: number,
  courseId: number
): Promise<boolean> {
  try {
    const sql = `
      INSERT INTO course_enrollments (course_id, student_id, enrollment_date, status)
      VALUES ($1, $2, CURRENT_TIMESTAMP, 'active')
      ON CONFLICT (course_id, student_id) DO NOTHING
      RETURNING id;
    `;

    const result = await query(sql, [courseId, studentId]);

    if (result.rows.length > 0) {
      const updateCourseSql = `
        UPDATE courses
        SET current_enrollment = current_enrollment + 1
        WHERE id = $1;
      `;
      await query(updateCourseSql, [courseId]);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
}

export async function unenrollStudent(
  studentId: number,
  courseId: number
): Promise<boolean> {
  try {
    const sql = `
      UPDATE course_enrollments
      SET status = 'dropped'
      WHERE course_id = $1 AND student_id = $2 AND status = 'active'
      RETURNING id;
    `;

    const result = await query(sql, [courseId, studentId]);

    if (result.rows.length > 0) {
      const updateCourseSql = `
        UPDATE courses
        SET current_enrollment = GREATEST(current_enrollment - 1, 0)
        WHERE id = $1;
      `;
      await query(updateCourseSql, [courseId]);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unenrolling student:', error);
    throw error;
  }
}
