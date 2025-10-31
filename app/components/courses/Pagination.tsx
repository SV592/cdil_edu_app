'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/courses',
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 2; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-2 py-8">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}?page=${currentPage - 1}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:border-cdil-purple hover:bg-cdil-purple/5 hover:text-cdil-purple"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
        </button>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-10 w-10 items-center justify-center text-gray-500"
            >
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isActive = pageNum === currentPage;

        return (
          <Link
            key={pageNum}
            href={`${basePath}?page=${pageNum}`}
            className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-semibold transition-colors ${
              isActive
                ? 'border-cdil-purple bg-cdil-purple text-white'
                : 'border-gray-300 bg-white text-gray-700 hover:border-cdil-purple hover:bg-cdil-purple/5 hover:text-cdil-purple'
            }`}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={`${basePath}?page=${currentPage + 1}`}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-700 transition-colors hover:border-cdil-purple hover:bg-cdil-purple/5 hover:text-cdil-purple"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        </Link>
      ) : (
        <button
          disabled
          className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-400"
        >
          <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        </button>
      )}
    </nav>
  );
}
