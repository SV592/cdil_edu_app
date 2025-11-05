'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faStar, faClock, faBook } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface CourseDetailHeaderProps {
  title: string;
  totalLessons: number;
  totalDurationMinutes: number;
  rating?: number;
  userRole: 'user' | 'admin' | 'superadmin';
  isEnrolled?: boolean;
  onEnroll?: () => void;
}

export default function CourseDetailHeader({
  title,
  totalLessons,
  totalDurationMinutes,
  rating = 4.5,
  userRole,
  isEnrolled,
  onEnroll,
}: CourseDetailHeaderProps) {
  const hours = Math.floor(totalDurationMinutes / 60);
  const minutes = totalDurationMinutes % 60;
  const durationText =
    hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  const isInstructor = userRole === 'admin' || userRole === 'superadmin';

  return (
    <div className="mb-4 w-full sm:mb-6">
      <nav className="mb-3 flex w-full items-center overflow-hidden text-xs sm:mb-4 sm:text-sm text-gray-600">
        <Link href="/courses" className="flex-shrink-0 hover:text-cdil-purple">
          Courses
        </Link>
        <FontAwesomeIcon icon={faChevronRight} className="mx-1 h-3 w-3 flex-shrink-0 sm:mx-2" />
        <span className="truncate text-gray-900">{title}</span>
      </nav>

      <div className="flex w-full flex-col gap-3 sm:gap-4">
        <div className="w-full overflow-hidden">
          <h1 className="break-words text-xl font-bold leading-tight text-cdil-purple sm:text-2xl md:text-3xl">
            {title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:mt-3 sm:gap-4 sm:text-sm text-gray-600">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FontAwesomeIcon icon={faBook} className="h-3 w-3 sm:h-4 sm:w-4 text-cdil-cyan" />
              <span>{totalLessons} lessons</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FontAwesomeIcon icon={faClock} className="h-3 w-3 sm:h-4 sm:w-4 text-cdil-cyan" />
              <span>{durationText}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FontAwesomeIcon icon={faStar} className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              <span className="font-medium">{rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {!isInstructor && !isEnrolled && (
          <button
            onClick={onEnroll}
            className="w-full sm:w-auto rounded-lg bg-cdil-purple px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white transition-colors hover:bg-cdil-purple/90"
          >
            Enroll Now
          </button>
        )}

        {!isInstructor && isEnrolled && (
          <div className="w-full sm:w-auto rounded-lg border-2 border-green-500 bg-green-50 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-green-700 text-center">
            Enrolled
          </div>
        )}
      </div>
    </div>
  );
}
