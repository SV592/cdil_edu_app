'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { courseFormSchema, type CourseFormData } from '@/lib/validation/courseSchema';
import { createCourse, updateCourse } from '@/app/actions/courses';

interface CourseFormProps {
  mode: 'create' | 'edit';
  courseId?: number;
  defaultValues?: Partial<CourseFormData>;
  departments: { id: number; name: string }[];
}

export default function CourseForm({ mode, courseId, defaultValues, departments }: CourseFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: defaultValues || {
      status: 'draft',
      language: 'English',
      deliveryMode: 'online',
    },
  });

  const deliveryMode = watch('deliveryMode');

  // Scroll to first error field
  const scrollToError = () => {
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  };

  // Auto-scroll when errors change
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      scrollToError();
    }
  }, [Object.keys(errors).length]);

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Serialize dates to ISO strings for server action
      const serializedData = {
        ...data,
        startDate: data.startDate instanceof Date ? data.startDate : new Date(data.startDate),
        endDate: data.endDate instanceof Date ? data.endDate : new Date(data.endDate),
      };

      const result = mode === 'create'
        ? await createCourse(serializedData)
        : await updateCourse(courseId!, serializedData);

      if (result.success) {
        // Force cache refresh and navigate
        router.refresh();
        // Use replace to avoid back button issues and add timestamp to force reload
        window.location.href = '/courses';
      } else {
        setError(result.error || 'An error occurred');
      }
    } catch (err) {
      console.error('Error in onSubmit:', err);
      setError('Failed to save course');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="sticky top-0 z-50 rounded-lg bg-yellow-50 p-4 border-2 border-yellow-400 shadow-lg">
          <h3 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-400 text-xs font-bold text-yellow-900">
              {Object.keys(errors).length}
            </span>
            Please fix the following errors:
          </h3>
          <ul className="space-y-2">
            {Object.entries(errors).map(([field, error]) => (
              <li key={field}>
                <button
                  type="button"
                  onClick={() => {
                    const element = document.getElementById(field);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      element.focus();
                    }
                  }}
                  className="text-left text-sm text-yellow-800 hover:text-yellow-900 hover:underline focus:outline-none focus:underline"
                >
                  <span className="font-medium capitalize">
                    {field.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  : {error?.message}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-cdil-purple">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700">
              Course Code <span className="text-red-500">*</span>
            </label>
            <input
              id="courseCode"
              type="text"
              {...register('courseCode')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
              placeholder="e.g., LONG-101"
            />
            {errors.courseCode && <p className="mt-1 text-sm text-red-600">{errors.courseCode.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-cdil-purple">Academic Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              id="departmentId"
              {...register('departmentId', {
                setValueAs: (v) => v === '' ? null : parseInt(v)
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="mt-1 text-sm text-red-600">{errors.departmentId.message}</p>}
          </div>

          <div>
            <label htmlFor="program" className="block text-sm font-medium text-gray-700">
              Program/Track
            </label>
            <input
              id="program"
              type="text"
              {...register('program')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.program && <p className="mt-1 text-sm text-red-600">{errors.program.message}</p>}
          </div>

          <div>
            <label htmlFor="difficultyLevel" className="block text-sm font-medium text-gray-700">
              Difficulty Level
            </label>
            <select
              id="difficultyLevel"
              {...register('difficultyLevel', {
                setValueAs: (v) => v === '' ? null : v
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            >
              <option value="">Select difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.difficultyLevel && <p className="mt-1 text-sm text-red-600">{errors.difficultyLevel.message}</p>}
          </div>

          <div>
            <label htmlFor="creditHours" className="block text-sm font-medium text-gray-700">
              Credit Hours
            </label>
            <input
              id="creditHours"
              type="number"
              {...register('creditHours', {
                setValueAs: (v) => v === '' ? null : parseInt(v)
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.creditHours && <p className="mt-1 text-sm text-red-600">{errors.creditHours.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language <span className="text-red-500">*</span>
            </label>
            <input
              id="language"
              type="text"
              {...register('language')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.language && <p className="mt-1 text-sm text-red-600">{errors.language.message}</p>}
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-cdil-purple">Schedule & Logistics</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate', {
                setValueAs: (v) => v ? new Date(v) : undefined
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>}
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date <span className="text-red-500">*</span>
            </label>
            <input
              id="endDate"
              type="date"
              {...register('endDate', {
                setValueAs: (v) => v ? new Date(v) : undefined
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
          </div>

          <div>
            <label htmlFor="durationWeeks" className="block text-sm font-medium text-gray-700">
              Duration (weeks)
            </label>
            <input
              id="durationWeeks"
              type="number"
              {...register('durationWeeks', {
                setValueAs: (v) => v === '' ? null : parseInt(v)
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.durationWeeks && <p className="mt-1 text-sm text-red-600">{errors.durationWeeks.message}</p>}
          </div>

          <div>
            <label htmlFor="deliveryMode" className="block text-sm font-medium text-gray-700">
              Delivery Mode <span className="text-red-500">*</span>
            </label>
            <select
              id="deliveryMode"
              {...register('deliveryMode')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            >
              <option value="online">Online</option>
              <option value="in_person">In Person</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.deliveryMode && <p className="mt-1 text-sm text-red-600">{errors.deliveryMode.message}</p>}
          </div>

          <div>
            <label htmlFor="campus" className="block text-sm font-medium text-gray-700">
              Campus
            </label>
            <select
              id="campus"
              {...register('campus', {
                setValueAs: (v) => v === '' ? null : v
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            >
              <option value="">Select campus</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Guyana">Guyana</option>
              <option value="Trinidad">Trinidad</option>
              <option value="USA">USA</option>
            </select>
            {errors.campus && <p className="mt-1 text-sm text-red-600">{errors.campus.message}</p>}
          </div>

          {(deliveryMode === 'in_person' || deliveryMode === 'hybrid') && (
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                {...register('location')}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
                placeholder="Building, Room, etc."
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-cdil-purple">Enrollment & Requirements</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="maxEnrollment" className="block text-sm font-medium text-gray-700">
              Maximum Enrollment
            </label>
            <input
              id="maxEnrollment"
              type="number"
              {...register('maxEnrollment', {
                setValueAs: (v) => v === '' ? null : parseInt(v)
              })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
            />
            {errors.maxEnrollment && <p className="mt-1 text-sm text-red-600">{errors.maxEnrollment.message}</p>}
          </div>

          <div>
            <label htmlFor="prerequisites" className="block text-sm font-medium text-gray-700">
              Prerequisites
            </label>
            <textarea
              id="prerequisites"
              rows={3}
              {...register('prerequisites')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
              placeholder="Enter prerequisites separated by commas"
            />
            {errors.prerequisites && <p className="mt-1 text-sm text-red-600">{errors.prerequisites.message}</p>}
            <p className="mt-1 text-sm text-gray-500">Separate multiple prerequisites with commas</p>
          </div>

          <div>
            <label htmlFor="learningOutcomes" className="block text-sm font-medium text-gray-700">
              Learning Outcomes
            </label>
            <textarea
              id="learningOutcomes"
              rows={4}
              {...register('learningOutcomes')}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-cdil-purple focus:outline-none focus:ring-1 focus:ring-cdil-purple"
              placeholder="Enter learning outcomes separated by semicolons"
            />
            {errors.learningOutcomes && <p className="mt-1 text-sm text-red-600">{errors.learningOutcomes.message}</p>}
            <p className="mt-1 text-sm text-gray-500">Separate multiple outcomes with semicolons</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-cdil-purple px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cdil-purple-dark disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Update Course'}
        </button>
      </div>
    </form>
  );
}
