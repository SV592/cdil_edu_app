import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import { getCourseDetailsWithModules } from '@/lib/data/courses';
import CourseDetailHeader from '@/app/components/courses/detail/CourseDetailHeader';
import CourseDetailTabs from '@/app/components/courses/detail/CourseDetailTabs';
import CourseAboutSection from '@/app/components/courses/detail/CourseAboutSection';
import ModuleAccordion from '@/app/components/courses/detail/ModuleAccordion';
import EnrollButton from './EnrollButton';

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const user = await getCurrentUser();
  const resolvedParams = await params;
  const courseId = parseInt(resolvedParams.id);

  if (isNaN(courseId)) {
    notFound();
  }

  const courseDetails = await getCourseDetailsWithModules(
    courseId,
    user.id,
    user.role
  );

  if (!courseDetails) {
    notFound();
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50 p-3 sm:p-4 md:p-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid w-full gap-4 md:gap-6 lg:grid-cols-3">
          <div className="w-full min-w-0 lg:col-span-2">
            <CourseDetailHeader
              title={courseDetails.title}
              totalLessons={courseDetails.totalLessons}
              totalDurationMinutes={courseDetails.totalDurationMinutes}
              userRole={user.role}
              isEnrolled={courseDetails.isEnrolled}
            />

            <div className="w-full overflow-hidden rounded-lg bg-white p-4 sm:p-6 shadow-sm">
              <CourseDetailTabs />

              <div className="mt-4 sm:mt-6">
                <CourseAboutSection
                  description={courseDetails.description}
                  learningOutcomes={courseDetails.learningOutcomes}
                />
              </div>
            </div>

            <div className="mt-4 w-full overflow-hidden md:mt-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm lg:hidden">
              <ModuleAccordion modules={courseDetails.modules} />
            </div>
          </div>

          <div className="hidden w-full min-w-0 lg:block">
            <div className="sticky top-8 rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-6">
                {user.role === 'user' && !courseDetails.isEnrolled && (
                  <EnrollButton courseId={courseId} />
                )}
                {user.role === 'user' && courseDetails.isEnrolled && (
                  <div className="rounded-lg border-2 border-green-500 bg-green-50 px-6 py-3 text-center font-semibold text-green-700">
                    Enrolled
                  </div>
                )}
              </div>

              <ModuleAccordion modules={courseDetails.modules} />

              <div className="mt-6 border-t border-gray-200 pt-6">
                <h3 className="mb-2 font-semibold text-gray-900">
                  Instructor
                </h3>
                <p className="text-sm text-gray-700">
                  {courseDetails.instructorName || 'TBA'}
                </p>

                {courseDetails.departmentName && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Department
                    </h3>
                    <p className="text-sm text-gray-700">
                      {courseDetails.departmentName}
                    </p>
                  </div>
                )}

                {courseDetails.campus && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Campus
                    </h3>
                    <p className="text-sm text-gray-700">
                      {courseDetails.campus}
                    </p>
                  </div>
                )}

                {courseDetails.difficultyLevel && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold text-gray-900">
                      Difficulty
                    </h3>
                    <span className="inline-block rounded bg-cdil-purple/10 px-3 py-1 text-sm font-medium capitalize text-cdil-purple">
                      {courseDetails.difficultyLevel}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 w-full overflow-hidden md:mt-6 rounded-lg bg-white p-4 sm:p-6 shadow-sm lg:hidden">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold text-gray-900">Instructor</h3>
              <p className="text-sm text-gray-700">
                {courseDetails.instructorName || 'TBA'}
              </p>
            </div>

            {courseDetails.departmentName && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Department
                </h3>
                <p className="text-sm text-gray-700">
                  {courseDetails.departmentName}
                </p>
              </div>
            )}

            {courseDetails.campus && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">Campus</h3>
                <p className="text-sm text-gray-700">
                  {courseDetails.campus}
                </p>
              </div>
            )}

            {courseDetails.difficultyLevel && (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-gray-900">
                  Difficulty
                </h3>
                <span className="inline-block rounded bg-cdil-purple/10 px-3 py-1 text-sm font-medium capitalize text-cdil-purple">
                  {courseDetails.difficultyLevel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
