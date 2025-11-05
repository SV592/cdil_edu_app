import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface CourseAboutSectionProps {
  description: string;
  learningOutcomes: string | null;
}

export default function CourseAboutSection({
  description,
  learningOutcomes,
}: CourseAboutSectionProps) {
  const outcomes = learningOutcomes
    ? learningOutcomes.split('\n').filter((line) => line.trim())
    : [];

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="w-full overflow-hidden">
        <h2 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
          About Course
        </h2>
        <p className="break-words text-sm leading-relaxed text-gray-700 sm:text-base">{description}</p>
      </div>

      {outcomes.length > 0 && (
        <div className="w-full overflow-hidden">
          <h2 className="mb-3 text-lg font-semibold text-gray-900 sm:mb-4 sm:text-xl">
            What You'll Learn
          </h2>
          <div className="grid w-full gap-2 sm:grid-cols-2 sm:gap-3">
            {outcomes.map((outcome, index) => (
              <div key={index} className="flex min-w-0 items-start gap-2 sm:gap-3">
                <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mt-1 sm:h-5 sm:w-5">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="h-2.5 w-2.5 text-green-600 sm:h-3 sm:w-3"
                  />
                </div>
                <span className="min-w-0 break-words text-xs text-gray-700 sm:text-sm">{outcome}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
