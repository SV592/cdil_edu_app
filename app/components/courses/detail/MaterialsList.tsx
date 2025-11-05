import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilePdf,
  faFileVideo,
  faLink,
  faFile,
  faFilePowerpoint,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import type { Material, ResourceType } from '@/app/types/course';

interface MaterialsListProps {
  materials: Material[];
}

function getResourceIcon(resourceType: ResourceType) {
  switch (resourceType) {
    case 'pdf':
      return { icon: faFilePdf, color: 'text-red-500' };
    case 'video':
      return { icon: faFileVideo, color: 'text-blue-500' };
    case 'link':
      return { icon: faLink, color: 'text-cdil-cyan' };
    case 'presentation':
      return { icon: faFilePowerpoint, color: 'text-orange-500' };
    case 'document':
    default:
      return { icon: faFile, color: 'text-gray-500' };
  }
}

export default function MaterialsList({ materials }: MaterialsListProps) {
  if (materials.length === 0) return null;

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {materials.map((material) => {
        const { icon, color } = getResourceIcon(material.resourceType);

        return (
          <a
            key={material.id}
            href={material.resourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 sm:gap-3 rounded-lg border border-gray-200 bg-gray-50 p-2 sm:p-3 transition-colors hover:bg-gray-100"
          >
            <FontAwesomeIcon icon={icon} className={`h-3 w-3 sm:h-4 sm:w-4 ${color} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                {material.title}
              </div>
              {material.description && (
                <div className="text-xs text-gray-600 line-clamp-1">
                  {material.description}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {material.format && (
                <span className="hidden sm:inline-block rounded bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
                  {material.format.toUpperCase()}
                </span>
              )}
              <FontAwesomeIcon
                icon={faDownload}
                className="h-3 w-3 text-gray-400"
              />
            </div>
          </a>
        );
      })}
    </div>
  );
}
