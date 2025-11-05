'use client';

import CourseCard from './CourseCard';
import CreateCourseButton from './CreateCourseButton';
import Pagination from './Pagination';
import type { CourseGridProps } from '@/app/types/course';
import { enrollInCourse } from '@/app/actions/courses';

export default function CourseGrid({
  courses,
  userRole,
  currentPage = 1,
  totalPages = 1,
  showPagination = true,
}: CourseGridProps) {
  const isInstructor = userRole === 'admin' || userRole === 'superadmin';

  const handleEnroll = async (courseId: number) => {
    try {
      const result = await enrollInCourse(courseId);
      if (result.success) {
        alert(result.message);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to enroll in course');
    }
  };

  if (courses.length === 0 && !isInstructor) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg bg-gray-50 p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            No courses available
          </h3>
          <p className="mt-2 text-gray-600">
            Check back later for new courses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isInstructor && <CreateCourseButton />}

        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            userRole={userRole}
            onEnroll={handleEnroll}
            onEdit={(courseId) => {
              console.log('Edit course:', courseId);
            }}
          />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/courses"
        />
      )}
    </>
  );
}
