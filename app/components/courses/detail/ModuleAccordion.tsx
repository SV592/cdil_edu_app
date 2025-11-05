'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import type { Module } from '@/app/types/course';
import LessonItem from './LessonItem';

interface ModuleAccordionProps {
  modules: Module[];
}

export default function ModuleAccordion({ modules }: ModuleAccordionProps) {
  const [openModules, setOpenModules] = useState<Set<number>>(new Set([modules[0]?.id]));

  const toggleModule = (moduleId: number) => {
    setOpenModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900">Course Content</h2>
      <div className="space-y-2">
        {modules.map((module) => {
          const isOpen = openModules.has(module.id);
          const lessonCount = module.lessons.length;
          const totalDuration = module.lessons.reduce(
            (sum, lesson) => sum + (lesson.durationMinutes || 0),
            0
          );
          const hours = Math.floor(totalDuration / 60);
          const minutes = totalDuration % 60;
          const durationText =
            hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

          return (
            <div
              key={module.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggleModule(module.id)}
                className="flex w-full items-center justify-between p-3 sm:p-4 text-left transition-colors hover:bg-gray-50"
              >
                <div className="flex-1 pr-2">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 leading-tight">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    {lessonCount} lessons • {durationText}
                  </p>
                </div>
                <FontAwesomeIcon
                  icon={isOpen ? faChevronUp : faChevronDown}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0"
                />
              </button>

              {isOpen && (
                <div className="border-t border-gray-200 bg-gray-50 p-3 sm:p-4">
                  {module.description && (
                    <p className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-600">
                      {module.description}
                    </p>
                  )}
                  <div className="space-y-2 sm:space-y-3">
                    {module.lessons.map((lesson) => (
                      <LessonItem key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
