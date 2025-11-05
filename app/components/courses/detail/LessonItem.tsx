'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faFileAlt,
  faPuzzlePiece,
  faQuestionCircle,
  faChevronDown,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import type { Lesson, ContentType } from '@/app/types/course';
import MaterialsList from './MaterialsList';

interface LessonItemProps {
  lesson: Lesson;
}

function getContentIcon(contentType: ContentType) {
  switch (contentType) {
    case 'video':
      return { icon: faPlay, color: 'text-cdil-purple' };
    case 'text':
      return { icon: faFileAlt, color: 'text-gray-600' };
    case 'interactive':
      return { icon: faPuzzlePiece, color: 'text-cdil-cyan' };
    case 'quiz':
      return { icon: faQuestionCircle, color: 'text-orange-500' };
    default:
      return { icon: faFileAlt, color: 'text-gray-600' };
  }
}

export default function LessonItem({ lesson }: LessonItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { icon, color } = getContentIcon(lesson.contentType);
  const durationText = lesson.durationMinutes
    ? `${lesson.durationMinutes} min`
    : null;

  const hasContent = lesson.description || lesson.materials.length > 0;

  return (
    <div className="border-l-2 border-gray-200 pl-2 sm:pl-4">
      <button
        onClick={() => hasContent && setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between py-1.5 sm:py-2 text-left ${
          hasContent ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'
        } rounded px-1.5 sm:px-2 transition-colors`}
        disabled={!hasContent}
      >
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
            <FontAwesomeIcon icon={icon} className={`h-3 w-3 sm:h-4 sm:w-4 ${color}`} />
          </div>
          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
            {lesson.title}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {durationText && (
            <span className="text-xs text-gray-500 whitespace-nowrap">{durationText}</span>
          )}
          {hasContent && (
            <FontAwesomeIcon
              icon={isOpen ? faChevronUp : faChevronDown}
              className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-400"
            />
          )}
        </div>
      </button>

      {isOpen && hasContent && (
        <div className="mt-2 space-y-2 sm:space-y-3 rounded-lg bg-white p-2 sm:p-3">
          {lesson.description && (
            <p className="text-xs sm:text-sm text-gray-600">{lesson.description}</p>
          )}
          {lesson.materials.length > 0 && (
            <div>
              <h4 className="mb-1.5 sm:mb-2 text-xs font-semibold uppercase text-gray-500">
                Materials
              </h4>
              <MaterialsList materials={lesson.materials} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
