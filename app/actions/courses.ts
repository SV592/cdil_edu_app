'use server';

import { revalidatePath } from 'next/cache';
import { getCurrentUser, isStudent } from '@/lib/auth';
import { enrollStudent, unenrollStudent } from '@/lib/data/courses';

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
