'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import type { CurrentUser } from '@/lib/auth';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  user: CurrentUser;
}

export default function AuthenticatedLayout({
  children,
  user,
}: AuthenticatedLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const userName = `${user.firstName} ${user.lastName}`;
  const roleLabel =
    user.role === 'user'
      ? 'Student'
      : user.role === 'superadmin'
        ? 'Administrator'
        : 'Instructor';

  return (
    <div className="flex min-h-screen">
      <Sidebar
        userRole={user.role}
        userName={userName}
        roleLabel={roleLabel}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <main className="flex-1 bg-base-200 pt-20 md:pt-0">{children}</main>

      <ThemeToggle />
    </div>
  );
}
