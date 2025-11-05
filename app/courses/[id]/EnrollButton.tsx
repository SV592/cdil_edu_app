'use client';

import { useRouter } from 'next/navigation';
import { enrollInCourse } from '@/app/actions/courses';

interface EnrollButtonProps {
  courseId: number;
}

export default function EnrollButton({ courseId }: EnrollButtonProps) {
  const router = useRouter();

  const handleEnroll = async () => {
    try {
      await enrollInCourse(courseId);
      router.refresh();
    } catch (error) {
      console.error('Failed to enroll:', error);
    }
  };

  return (
    <button
      onClick={handleEnroll}
      className="w-full rounded-lg bg-cdil-purple px-6 py-3 font-semibold text-white transition-colors hover:bg-cdil-purple/90"
    >
      Enroll Now
    </button>
  );
}
