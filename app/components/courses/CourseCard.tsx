'use client';

import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook,
  faGraduationCap,
  faBookOpen,
  faBuilding,
  faLocationDot,
  faCalendar,
  faUserTie,
  faClock,
  faUsers,
  faListCheck,
} from '@fortawesome/free-solid-svg-icons';
import type { CourseCardProps } from '@/app/types/course';

export default function CourseCard({
  course,
  userRole,
  onEnroll,
  onEdit,
}: CourseCardProps) {
  const router = useRouter();
  const isStudent = userRole === 'user';
  const isInstructor = userRole === 'admin' || userRole === 'superadmin';

  const getStatusBadgeColor = () => {
    switch (course.status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'draft':
        return 'bg-gray-100 text-gray-700';
      case 'archived':
        return 'bg-orange-100 text-orange-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyColor = () => {
    switch (course.difficultyLevel) {
      case 'beginner':
        return 'bg-cdil-cyan/10 text-cdil-cyan';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700';
      case 'advanced':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAction = () => {
    router.push(`/courses/${course.id}`);
  };

  const getActionButtonText = () => {
    if (isStudent) {
      if (course.isEnrolled) {
        return 'Continue';
      }
      return 'View';
    }
    return 'Edit';
  };

  const getActionButtonStyle = () => {
    if (isStudent && course.isEnrolled) {
      return 'bg-cdil-cyan text-white hover:bg-cdil-cyan-dark';
    }
    if (isStudent) {
      return 'bg-cdil-purple text-white hover:bg-cdil-purple-dark';
    }
    return 'border border-cdil-purple text-cdil-purple hover:bg-cdil-purple hover:text-white';
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor()}`}
          >
            {course.moduleCount} {course.moduleCount === 1 ? 'Module' : 'Modules'}
          </span>

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cdil-purple/10">
            <FontAwesomeIcon
              icon={faBook}
              className="h-6 w-6 text-cdil-purple"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-3">
            {course.description ? truncateDescription(course.description) : 'No description available'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {course.difficultyLevel && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor()}`}
            >
              {course.difficultyLevel}
            </span>
          )}
          {course.prerequisitesCount !== undefined && course.prerequisitesCount > 0 && (
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
              {course.prerequisitesCount} {course.prerequisitesCount === 1 ? 'Prerequisite' : 'Prerequisites'}
            </span>
          )}
          {course.creditHours && (
            <span className="rounded-full bg-cdil-purple/10 px-3 py-1 text-xs font-medium text-cdil-purple">
              {course.creditHours} Credits
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-600">
          {/* Column 1 */}
          {course.instructorName && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUserTie} className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{course.instructorName}</span>
            </div>
          )}

          {/* Column 2 */}
          {course.campus && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{course.campus}</span>
            </div>
          )}

          {/* Column 1 */}
          {course.departmentName && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faBuilding} className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{course.departmentName}</span>
            </div>
          )}

          {/* Column 2 */}
          {course.maxEnrollment && (
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faUsers} className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">
                {course.currentEnrollment || 0} / {course.maxEnrollment} Students
              </span>
            </div>
          )}

          {/* Column 1 - Date range spans both columns if needed */}
          <div className="col-span-2 flex items-center gap-2">
            <FontAwesomeIcon icon={faCalendar} className="h-3 w-3 flex-shrink-0" />
            <span>
              {formatDate(course.startDate)} - {formatDate(course.endDate)}
            </span>
          </div>
        </div>

      </div>

      <div className="p-6 pt-0">
        <button
          onClick={handleAction}
          className={`w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${getActionButtonStyle()}`}
        >
          {getActionButtonText()}
        </button>
      </div>
    </div>
  );
}
