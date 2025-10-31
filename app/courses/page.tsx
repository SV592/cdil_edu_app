import { Suspense } from 'react';
import { getCurrentUser, isInstructor } from '@/lib/auth';
import {
  getCoursesForStudent,
  getCoursesForInstructor,
  getCoursesCountForStudent,
  getCoursesCountForInstructor,
} from '@/lib/data/courses';
import CourseGrid from '../components/courses/CourseGrid';

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="h-[300px] animate-pulse rounded-xl bg-gray-200"
        />
      ))}
    </div>
  );
}

async function CoursesContent({ page }: { page: number }) {
  try {
    const user = await getCurrentUser();
    const limit = 9;

    let courses;
    let totalCount;

    if (isInstructor(user)) {
      courses = await getCoursesForInstructor(
        user.instructorId!,
        user.role === 'superadmin',
        page,
        limit
      );
      totalCount = await getCoursesCountForInstructor(
        user.instructorId!,
        user.role === 'superadmin'
      );
    } else {
      courses = await getCoursesForStudent(user.studentId!, page, limit);
      totalCount = await getCoursesCountForStudent(user.studentId!);
    }

    const totalPages = Math.ceil(totalCount / limit);

    return (
      <CourseGrid
        courses={courses}
        userRole={user.role}
        currentPage={page}
        totalPages={totalPages}
      />
    );
  } catch (error) {
    console.error('Error fetching courses:', error);
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-red-50 p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-red-900">
            Error Loading Courses
          </h3>
          <p className="mt-2 text-red-700">
            There was a problem connecting to the database. Please check your
            connection settings.
          </p>
          <p className="mt-4 text-sm text-red-600">
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
      </div>
    );
  }
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const user = await getCurrentUser();
  const roleLabel = isInstructor(user) ? 'Instructor' : 'Student';
  const page = Number(searchParams?.page) || 1;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cdil-purple">Courses</h1>
              <p className="mt-2 text-gray-600">
                {isInstructor(user)
                  ? 'Manage your courses and track student progress'
                  : 'Browse and enroll in available courses'}
              </p>
            </div>
            <div className="rounded-lg bg-white px-4 py-2 shadow-sm">
              <span className="text-sm font-medium text-gray-600">
                Viewing as:{' '}
              </span>
              <span className="font-semibold text-cdil-purple">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CoursesContent page={page} />
        </Suspense>
      </div>
    </div>
  );
}
