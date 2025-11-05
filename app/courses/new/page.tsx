import { redirect } from 'next/navigation';
import { getCurrentUser, isInstructor } from '@/lib/auth';
import { getDepartments } from '@/lib/data/courses';
import CourseForm from '@/app/components/courses/forms/CourseForm';

export default async function NewCoursePage() {
  const user = await getCurrentUser();

  if (!isInstructor(user)) {
    redirect('/courses');
  }

  const departments = await getDepartments();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-cdil-purple">Create New Course</h1>
          <p className="mt-2 text-gray-600">
            Fill in the details below to create a new course
          </p>
        </div>

        <CourseForm
          mode="create"
          departments={departments}
        />
      </div>
    </div>
  );
}
