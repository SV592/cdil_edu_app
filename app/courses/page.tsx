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

    if (isInstructor(user)) {
      const courses = await getCoursesForInstructor(
        user.instructorId!,
        user.role === 'superadmin',
        page,
        limit
      );
      const totalCount = await getCoursesCountForInstructor(
        user.instructorId!,
        user.role === 'superadmin'
      );
      const totalPages = Math.ceil(totalCount / limit);

      return (
        <CourseGrid
          courses={courses}
          userRole={user.role}
          currentPage={page}
          totalPages={totalPages}
        />
      );
    } else {
      // For students, separate enrolled and available courses
      const allCourses = await getCoursesForStudent(user.studentId!, page, limit);
      const enrolledCourses = allCourses.filter(course => course.isEnrolled);
      const availableCourses = allCourses.filter(course => !course.isEnrolled);

      return (
        <div className="space-y-12">
          {enrolledCourses.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-cdil-purple">My Enrolled Courses</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Continue learning from where you left off
                </p>
              </div>
              <CourseGrid
                courses={enrolledCourses}
                userRole={user.role}
                currentPage={1}
                totalPages={1}
                showPagination={false}
              />
            </div>
          )}

          {availableCourses.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-cdil-purple">
                  {enrolledCourses.length > 0 ? 'Available Courses' : 'Browse Courses'}
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Discover new courses to expand your knowledge
                </p>
              </div>
              <CourseGrid
                courses={availableCourses}
                userRole={user.role}
                currentPage={1}
                totalPages={1}
                showPagination={false}
              />
            </div>
          )}

          {enrolledCourses.length === 0 && availableCourses.length === 0 && (
            <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-50 p-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  No Courses Available
                </h3>
                <p className="mt-2 text-gray-600">
                  Check back later for new courses.
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }
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
