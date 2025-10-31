import { getCurrentUser, isInstructor } from '@/lib/auth';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const userName = `${user.firstName} ${user.lastName}`;
  const isTeacher = isInstructor(user);

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-bold text-cdil-purple">
          Welcome, {user.firstName}!
        </h1>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-cdil-purple">
            {isTeacher ? 'Instructor Dashboard' : 'Student Dashboard'}
          </h2>
          <p className="mb-4 text-gray-600">
            You are currently logged in as{' '}
            <strong>{userName}</strong> ({user.email}).
          </p>

          <div className="mt-6 rounded-lg bg-cdil-cyan/10 p-4">
            <h3 className="mb-2 font-semibold text-cdil-purple">
              Getting Started:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {isTeacher ? (
                <>
                  <li>
                    • Click <strong>Courses</strong> in the sidebar to manage
                    your courses
                  </li>
                  <li>
                    • View and track student progress across all your courses
                  </li>
                  <li>• Create and manage assignments and grades</li>
                  <li>• Access analytics and insights</li>
                </>
              ) : (
                <>
                  <li>
                    • Click <strong>Courses</strong> in the sidebar to browse
                    available courses
                  </li>
                  <li>• Enroll in courses that interest you</li>
                  <li>• Track your progress and grades</li>
                  <li>• Access LongevityX programs</li>
                  <li>• View and download your certifications</li>
                </>
              )}
            </ul>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">
                {isTeacher ? 'My Courses' : 'Enrolled Courses'}
              </h4>
              <p className="mt-2 text-3xl font-bold text-cdil-purple">
                {isTeacher ? '3' : '2'}
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">
                {isTeacher ? 'Total Students' : 'Completed'}
              </h4>
              <p className="mt-2 text-3xl font-bold text-cdil-cyan">
                {isTeacher ? '45' : '0'}
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-4">
              <h4 className="font-semibold text-gray-900">
                {isTeacher ? 'Pending Grading' : 'In Progress'}
              </h4>
              <p className="mt-2 text-3xl font-bold text-orange-500">
                {isTeacher ? '12' : '2'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
