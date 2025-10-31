'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function CreateCourseButton() {
  const handleCreate = () => {
    console.log('Create new course clicked');
    // TODO: Open course creation modal/form
  };

  return (
    <button
      onClick={handleCreate}
      className="group flex min-h-[300px] flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 transition-all duration-300 hover:border-cdil-purple hover:bg-cdil-purple/5"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cdil-purple/10 transition-colors group-hover:bg-cdil-purple">
        <FontAwesomeIcon
          icon={faPlus}
          className="h-8 w-8 text-cdil-purple transition-colors group-hover:text-white"
        />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">
          Create New Course
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          Add a new course to the platform
        </p>
      </div>
    </button>
  );
}
