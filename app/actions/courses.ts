'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser, isStudent, isInstructor } from '@/lib/auth';
import { enrollStudent, unenrollStudent, createCourse as dbCreateCourse, updateCourse as dbUpdateCourse } from '@/lib/data/courses';
import { courseFormSchema } from '@/lib/validation/courseSchema';
import type { CourseFormData } from '@/lib/validation/courseSchema';

export async function enrollInCourse(courseId: number) {
  try {
    const user = await getCurrentUser();

    if (!isStudent(user) || !user.studentId) {
      return {
        success: false,
        error: 'Only students can enroll in courses',
      };
    }

    const enrolled = await enrollStudent(user.studentId, courseId);

    if (enrolled) {
      revalidatePath('/courses');
      revalidatePath(`/courses/${courseId}`);
      return {
        success: true,
        message: 'Successfully enrolled in course',
      };
    }

    return {
      success: false,
      error: 'Already enrolled in this course',
    };
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return {
      success: false,
      error: 'Failed to enroll in course',
    };
  }
}

export async function dropCourse(courseId: number) {
  try {
    const user = await getCurrentUser();

    if (!isStudent(user) || !user.studentId) {
      return {
        success: false,
        error: 'Only students can drop courses',
      };
    }

    const dropped = await unenrollStudent(user.studentId, courseId);

    if (dropped) {
      revalidatePath('/courses');
      revalidatePath(`/courses/${courseId}`);
      return {
        success: true,
        message: 'Successfully dropped course',
      };
    }

    return {
      success: false,
      error: 'Not enrolled in this course',
    };
  } catch (error) {
    console.error('Error dropping course:', error);
    return {
      success: false,
      error: 'Failed to drop course',
    };
  }
}

export async function createCourse(formData: CourseFormData) {
  try {
    const user = await getCurrentUser();

    if (!isInstructor(user) || !user.instructorId) {
      return {
        success: false,
        error: 'Only instructors can create courses',
      };
    }

    const validated = courseFormSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid course data',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const courseId = await dbCreateCourse({
      ...validated.data,
      createdBy: user.id,
    });

    revalidatePath('/courses');

    return {
      success: true,
      courseId,
      message: 'Course created successfully',
    };
  } catch (error: any) {
    console.error('Error creating course:', error);

    // Check for unique constraint violation (duplicate course code)
    if (error.code === '23505' && error.constraint === 'courses_course_code_unique') {
      return {
        success: false,
        error: `A course with code "${formData.courseCode}" already exists. Please use a different course code.`,
      };
    }

    return {
      success: false,
      error: 'Failed to create course',
    };
  }
}

export async function updateCourse(courseId: number, formData: CourseFormData) {
  try {
    const user = await getCurrentUser();

    if (!isInstructor(user)) {
      return {
        success: false,
        error: 'Only instructors can update courses',
      };
    }

    const validated = courseFormSchema.safeParse(formData);

    if (!validated.success) {
      return {
        success: false,
        error: 'Invalid course data',
        errors: validated.error.flatten().fieldErrors,
      };
    }

    const updated = await dbUpdateCourse(courseId, validated.data);

    if (!updated) {
      return {
        success: false,
        error: 'Course not found or update failed',
      };
    }

    revalidatePath('/courses');
    revalidatePath(`/courses/${courseId}`);

    return {
      success: true,
      message: 'Course updated successfully',
    };
  } catch (error) {
    console.error('Error updating course:', error);
    return {
      success: false,
      error: 'Failed to update course',
    };
  }
}
