import { query } from '../db';

// TypeScript Interfaces

interface Department {
  id: number;
  name: string;
  description: string | null;
  departmentHeadId: number | null;
  departmentHeadName: string | null;
  campus: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface InstructorProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  employeeId: string | null;
  departmentId: number | null;
  departmentName: string | null;
  qualifications: string | null;
  bio: string | null;
  status: 'active' | 'on_leave' | 'inactive';
  hireDate: Date | null;
}

interface StudentProfile {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  major: string | null;
  enrollmentDate: Date | null;
  status: 'active' | 'graduated' | 'withdrawn' | 'suspended';
}

interface InstructorStats {
  instructorId: number;
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  departmentName: string | null;
}

// Data Layer Functions

/**
 * Fetch all departments with pagination
 * @param limit - Maximum number of departments to return (default: 50)
 * @param offset - Number of departments to skip (default: 0)
 * @returns Array of departments with department head information
 */
export async function getDepartments(limit: number = 50, offset: number = 0): Promise<Department[]> {
  try {
    const sql = `
      SELECT
        d.id,
        d.name,
        d.description,
        d.department_head_id as "departmentHeadId",
        u.first_name || ' ' || u.last_name as "departmentHeadName",
        d.campus,
        d.created_at as "createdAt",
        d.updated_at as "updatedAt"
      FROM departments d
      LEFT JOIN users u ON d.department_head_id = u.id
      ORDER BY d.name ASC
      LIMIT $1 OFFSET $2
    `;

    const result = await query<any>(sql, [limit, offset]);

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      departmentHeadId: row.departmentHeadId,
      departmentHeadName: row.departmentHeadName,
      campus: row.campus,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    console.error('Error in getDepartments:', error);
    throw error;
  }
}

/**
 * Fetch a single department by ID
 * @param departmentId - The ID of the department to fetch
 * @returns Department object or null if not found
 */
export async function getDepartmentById(departmentId: number): Promise<Department | null> {
  try {
    const sql = `
      SELECT
        d.id,
        d.name,
        d.description,
        d.department_head_id as "departmentHeadId",
        u.first_name || ' ' || u.last_name as "departmentHeadName",
        d.campus,
        d.created_at as "createdAt",
        d.updated_at as "updatedAt"
      FROM departments d
      LEFT JOIN users u ON d.department_head_id = u.id
      WHERE d.id = $1
    `;

    const result = await query<any>(sql, [departmentId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      departmentHeadId: row.departmentHeadId,
      departmentHeadName: row.departmentHeadName,
      campus: row.campus,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    };
  } catch (error) {
    console.error('Error in getDepartmentById:', error);
    throw error;
  }
}

/**
 * Get instructor profile by user ID
 * @param userId - The user ID of the instructor
 * @returns InstructorProfile object or null if not found
 */
export async function getInstructorProfile(userId: number): Promise<InstructorProfile | null> {
  try {
    const sql = `
      SELECT
        u.id as "userId",
        u.email,
        u.first_name as "firstName",
        u.last_name as "lastName",
        i.employee_id as "employeeId",
        i.department_id as "departmentId",
        d.name as "departmentName",
        i.qualifications,
        i.bio,
        i.status,
        i.hire_date as "hireDate"
      FROM users u
      INNER JOIN instructors i ON u.id = i.user_id
      LEFT JOIN departments d ON i.department_id = d.id
      WHERE u.id = $1
    `;

    const result = await query<any>(sql, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      userId: row.userId,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      employeeId: row.employeeId,
      departmentId: row.departmentId,
      departmentName: row.departmentName,
      qualifications: row.qualifications,
      bio: row.bio,
      status: row.status,
      hireDate: row.hireDate ? new Date(row.hireDate) : null,
    };
  } catch (error) {
    console.error('Error in getInstructorProfile:', error);
    throw error;
  }
}

/**
 * Get student profile by user ID
 * @param userId - The user ID of the student
 * @returns StudentProfile object or null if not found
 */
export async function getStudentProfile(userId: number): Promise<StudentProfile | null> {
  try {
    const sql = `
      SELECT
        u.id as "userId",
        u.email,
        u.first_name as "firstName",
        u.last_name as "lastName",
        s.student_number as "studentNumber",
        s.major,
        s.enrollment_date as "enrollmentDate",
        s.status
      FROM users u
      INNER JOIN students s ON u.id = s.user_id
      WHERE u.id = $1
    `;

    const result = await query<any>(sql, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      userId: row.userId,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      studentNumber: row.studentNumber,
      major: row.major,
      enrollmentDate: row.enrollmentDate ? new Date(row.enrollmentDate) : null,
      status: row.status,
    };
  } catch (error) {
    console.error('Error in getStudentProfile:', error);
    throw error;
  }
}

/**
 * Get all active instructors in a specific department
 * @param departmentId - The ID of the department
 * @returns Array of InstructorProfile objects
 */
export async function getInstructorsByDepartment(departmentId: number): Promise<InstructorProfile[]> {
  try {
    const sql = `
      SELECT
        u.id as "userId",
        u.email,
        u.first_name as "firstName",
        u.last_name as "lastName",
        i.employee_id as "employeeId",
        i.department_id as "departmentId",
        d.name as "departmentName",
        i.qualifications,
        i.bio,
        i.status,
        i.hire_date as "hireDate"
      FROM users u
      INNER JOIN instructors i ON u.id = i.user_id
      LEFT JOIN departments d ON i.department_id = d.id
      WHERE i.department_id = $1 AND i.status = 'active'
      ORDER BY u.last_name ASC, u.first_name ASC
    `;

    const result = await query<any>(sql, [departmentId]);

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map(row => ({
      userId: row.userId,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      employeeId: row.employeeId,
      departmentId: row.departmentId,
      departmentName: row.departmentName,
      qualifications: row.qualifications,
      bio: row.bio,
      status: row.status,
      hireDate: row.hireDate ? new Date(row.hireDate) : null,
    }));
  } catch (error) {
    console.error('Error in getInstructorsByDepartment:', error);
    throw error;
  }
}

/**
 * Calculate teaching statistics for an instructor
 * @param instructorId - The user ID of the instructor
 * @returns InstructorStats object or null if not found
 */
export async function getInstructorStats(instructorId: number): Promise<InstructorStats | null> {
  try {
    const sql = `
      SELECT
        i.user_id as "instructorId",
        COUNT(DISTINCT ci.course_id) as "totalCourses",
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN ci.course_id END) as "activeCourses",
        COUNT(DISTINCT ce.student_id) as "totalStudents",
        d.name as "departmentName"
      FROM instructors i
      LEFT JOIN course_instructors ci ON i.user_id = ci.instructor_id
      LEFT JOIN courses c ON ci.course_id = c.id
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      LEFT JOIN departments d ON i.department_id = d.id
      WHERE i.user_id = $1
      GROUP BY i.user_id, d.name
    `;

    const result = await query<any>(sql, [instructorId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      instructorId: row.instructorId,
      totalCourses: Number(row.totalCourses) || 0,
      activeCourses: Number(row.activeCourses) || 0,
      totalStudents: Number(row.totalStudents) || 0,
      departmentName: row.departmentName,
    };
  } catch (error) {
    console.error('Error in getInstructorStats:', error);
    throw error;
  }
}

/**
 * Filter departments by campus location
 * @param campus - The campus location to filter by
 * @returns Array of departments at the specified campus
 */
export async function getDepartmentsByCampus(campus: string): Promise<Department[]> {
  try {
    const sql = `
      SELECT
        d.id,
        d.name,
        d.description,
        d.department_head_id as "departmentHeadId",
        u.first_name || ' ' || u.last_name as "departmentHeadName",
        d.campus,
        d.created_at as "createdAt",
        d.updated_at as "updatedAt"
      FROM departments d
      LEFT JOIN users u ON d.department_head_id = u.id
      WHERE d.campus = $1
      ORDER BY d.name ASC
    `;

    const result = await query<any>(sql, [campus]);

    if (result.rows.length === 0) {
      return [];
    }

    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      departmentHeadId: row.departmentHeadId,
      departmentHeadName: row.departmentHeadName,
      campus: row.campus,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    }));
  } catch (error) {
    console.error('Error in getDepartmentsByCampus:', error);
    throw error;
  }
}
