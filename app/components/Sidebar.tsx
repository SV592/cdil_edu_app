'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGauge,
  faBook,
  faUserGraduate,
  faComments,
  faChartLine,
  faHeartPulse,
  faCertificate,
  faUsers,
  faBars,
  faChevronLeft,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import type { SidebarProps, MenuItem, MenuSection } from '@/app/types/sidebar';
import { logoutAction } from '../actions/auth';

// Define menu items for teachers (admin role)
const teacherMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: faGauge,
    href: '/dashboard',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: faBook,
    href: '/courses',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'students',
    label: 'Students',
    icon: faUserGraduate,
    href: '/teacher/students',
    roles: ['admin', 'superadmin'],
  },
  {
    id: 'discussion',
    label: 'Discussion Board',
    icon: faComments,
    href: '/teacher/discussion',
    roles: ['admin', 'superadmin'],
  },
];

// Define menu items for students (user role)
const studentMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: faGauge,
    href: '/dashboard',
    roles: ['user'],
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: faBook,
    href: '/courses',
    roles: ['user'],
  },
  {
    id: 'grades',
    label: 'Grades',
    icon: faChartLine,
    href: '/student/grades',
    roles: ['user'],
  },
  {
    id: 'longevityx',
    label: 'LongevityX',
    icon: faHeartPulse,
    href: '/student/longevityx',
    roles: ['user'],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: faCertificate,
    href: '/student/certifications',
    roles: ['user'],
  },
  {
    id: 'discussion',
    label: 'Discussion Board',
    icon: faComments,
    href: '/student/discussion',
    roles: ['user'],
  },
];

export default function Sidebar({
  userRole,
  userName,
  userAvatar,
  isOpen = true,
  onToggle
}: SidebarProps) {
  // Get menu items based on user role
  const menuItems =
    userRole === 'admin' || userRole === 'superadmin'
      ? teacherMenuItems
      : studentMenuItems;

  const roleLabel =
    userRole === 'admin' || userRole === 'superadmin' ? 'Instructor' : 'Student';

  // Handle menu item click on mobile - close sidebar
  const handleMenuItemClick = () => {
    if (onToggle && window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {isOpen && onToggle && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Toggle Button  */}
      {!isOpen && onToggle && (
        <button
          onClick={onToggle}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-base-100 text-primary shadow-lg transition-colors hover:bg-primary hover:text-primary-content md:left-4 md:top-4"
          aria-label="Open sidebar"
        >
          <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-base-100 shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between border-b border-base-300 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <FontAwesomeIcon icon={faUsers} className="h-5 w-5 text-primary-content" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-base-content">CDIL</h1>
              <p className="text-xs text-base-content font-semibold">Education Platform</p>
            </div>
          </div>
          {onToggle && (
            <button
              onClick={onToggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-base-content/60 transition-colors hover:bg-base-200 hover:text-primary"
              aria-label="Close sidebar"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="mb-2 px-3 text-sm font-semibold uppercase tracking-wider text-base-content/60">
            Main Menu
          </div>
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={handleMenuItemClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-md text-base-content transition-colors hover:bg-primary hover:text-primary-content"
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-base-300 p-4">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-content font-semibold">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <span className="text-sm">
                  {userName
                    ? userName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    : 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-md font-semibold text-base-content">
                {userName || 'User Name'}
              </p>
              <p className="text-sm text-base-content/60">{roleLabel}</p>
            </div>
          </div>

          {/* Logout Button */}
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
