'use client';

import { useState } from 'react';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [viewMode, setViewMode] = useState<'teacher' | 'student'>('teacher');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        userRole={viewMode === 'teacher' ? 'admin' : 'user'}
        userName={viewMode === 'teacher' ? 'Dr. Maria Johnson' : 'John Doe'}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-4 md:p-8 pt-20 md:pt-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 text-4xl font-bold text-cdil-purple">
            CDIL Education Platform
          </h1>

          {/* View Toggle */}
          <div className="mb-8 flex gap-4">
            <button
              onClick={() => setViewMode('teacher')}
              className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
                viewMode === 'teacher'
                  ? 'bg-cdil-purple text-white'
                  : 'bg-white text-cdil-purple hover:bg-gray-100'
              }`}
            >
              Teacher View
            </button>
            <button
              onClick={() => setViewMode('student')}
              className={`rounded-lg px-6 py-3 font-semibold transition-colors ${
                viewMode === 'student'
                  ? 'bg-cdil-purple text-white'
                  : 'bg-white text-cdil-purple hover:bg-gray-100'
              }`}
            >
              Student View
            </button>
          </div>

          {/* Info Card */}
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-semibold text-cdil-purple">
              {viewMode === 'teacher' ? 'Instructor Dashboard' : 'Student Dashboard'}
            </h2>
            <p className="mb-4 text-gray-600">
              You are currently viewing the{' '}
              <strong>{viewMode === 'teacher' ? 'Instructor' : 'Student'}</strong>{' '}
              interface. The sidebar on the left shows the navigation menu specific to
              this role.
            </p>

            <div className="mt-6 rounded-lg bg-cdil-cyan/10 p-4">
              <h3 className="mb-2 font-semibold text-cdil-purple">
                Available Menu Items:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {viewMode === 'teacher' ? (
                  <>
                    <li>• Dashboard - Overview and analytics</li>
                    <li>• Courses - Create, manage, and track course attendance</li>
                    <li>• Student Profiles - View and manage student information</li>
                    <li>• Discussion Board - Facilitate class discussions</li>
                  </>
                ) : (
                  <>
                    <li>• Dashboard - Personal overview</li>
                    <li>• Courses - View and register for courses</li>
                    <li>• Grades & Progress - Track learning milestones</li>
                    <li>• LongevityX - Health science programs</li>
                    <li>• Certifications - View and download certificates</li>
                    <li>• Discussion Board - Participate in discussions</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
