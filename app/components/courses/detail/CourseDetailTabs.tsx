'use client';

import { useState } from 'react';

export type TabType = 'overview' | 'author' | 'faq' | 'announcements' | 'reviews';

interface CourseDetailTabsProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'author', label: 'Author' },
  { id: 'faq', label: 'FAQ' },
  { id: 'announcements', label: 'Announcements' },
  { id: 'reviews', label: 'Reviews' },
];

export default function CourseDetailTabs({
  activeTab: controlledActiveTab,
  onTabChange,
}: CourseDetailTabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('overview');

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = (tab: TabType) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalActiveTab(tab);
    }
  };

  return (
    <div className="w-full border-b border-gray-200">
      <nav className="-mb-px flex w-full space-x-4 overflow-x-auto sm:space-x-8 scrollbar-hide">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-shrink-0 whitespace-nowrap border-b-2 px-1 py-3 text-xs font-medium transition-colors sm:py-4 sm:text-sm ${
                isActive
                  ? 'border-cdil-purple text-cdil-purple'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
