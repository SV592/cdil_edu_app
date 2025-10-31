import { getAllMockUsers } from '@/lib/auth';
import { loginAction } from '../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faUserTie,
  faUserShield,
} from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const allUsers = getAllMockUsers();

  const superadmins = allUsers.filter((u) => u.role === 'superadmin');
  const instructors = allUsers.filter((u) => u.role === 'admin');
  const students = allUsers.filter((u) => u.role === 'user');

  const getRoleIcon = (role: string) => {
    if (role === 'superadmin') return faUserShield;
    if (role === 'admin') return faUserTie;
    return faUser;
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'superadmin') return 'bg-red-100 text-red-700';
    if (role === 'admin') return 'bg-cdil-purple/10 text-cdil-purple';
    return 'bg-cdil-cyan/10 text-cdil-cyan';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-cdil-purple to-cdil-cyan p-4">
      <div className="w-full max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">
            CDIL Education Platform
          </h1>
          <p className="mt-2 text-lg text-white/90">
            Select a user to login (Demo Mode)
          </p>
        </div>

        <div className="space-y-6">
          {/* Superadmin Section */}
          {superadmins.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="h-5 w-5 text-red-600"
                />
                System Administrators
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {superadmins.map((user) => (
                  <form key={user.id} action={loginAction.bind(null, user.id)}>
                    <button
                      type="submit"
                      className="group w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-red-500 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <FontAwesomeIcon
                              icon={getRoleIcon(user.role)}
                              className="h-6 w-6 text-red-600"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          Admin
                        </span>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* Instructors Section */}
          {instructors.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                <FontAwesomeIcon
                  icon={faUserTie}
                  className="h-5 w-5 text-cdil-purple"
                />
                Instructors
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {instructors.map((user) => (
                  <form key={user.id} action={loginAction.bind(null, user.id)}>
                    <button
                      type="submit"
                      className="group w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-cdil-purple hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cdil-purple/10">
                            <FontAwesomeIcon
                              icon={getRoleIcon(user.role)}
                              className="h-6 w-6 text-cdil-purple"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          Instructor
                        </span>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* Students Section */}
          {students.length > 0 && (
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-gray-900">
                <FontAwesomeIcon
                  icon={faUser}
                  className="h-5 w-5 text-cdil-cyan"
                />
                Students
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {students.map((user) => (
                  <form key={user.id} action={loginAction.bind(null, user.id)}>
                    <button
                      type="submit"
                      className="group w-full rounded-lg border-2 border-gray-200 bg-white p-4 text-left transition-all hover:border-cdil-cyan hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cdil-cyan/10">
                            <FontAwesomeIcon
                              icon={getRoleIcon(user.role)}
                              className="h-6 w-6 text-cdil-cyan"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(user.role)}`}
                        >
                          Student
                        </span>
                      </div>
                    </button>
                  </form>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-white/70">
          This is a demo authentication system. Click any user to login.
        </p>
      </div>
    </div>
  );
}
