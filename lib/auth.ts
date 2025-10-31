import { getUserIdFromCookie } from '@/app/actions/auth';
import { redirect } from 'next/navigation';
import type { UserRole } from '@/app/types/sidebar';

export interface CurrentUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  studentId?: number;
  instructorId?: number;
}

const MOCK_USERS: CurrentUser[] = [
  {
    id: 1,
    email: 'admin@cdil.edu',
    firstName: 'System',
    lastName: 'Administrator',
    role: 'superadmin',
  },
  {
    id: 2,
    email: 'dr.johnson@cdil.edu',
    firstName: 'Maria',
    lastName: 'Johnson',
    role: 'admin',
    instructorId: 1,
  },
  {
    id: 3,
    email: 'prof.williams@cdil.edu',
    firstName: 'James',
    lastName: 'Williams',
    role: 'admin',
    instructorId: 2,
  },
  {
    id: 4,
    email: 'dr.brown@cdil.edu',
    firstName: 'Sarah',
    lastName: 'Brown',
    role: 'admin',
    instructorId: 3,
  },
  {
    id: 5,
    email: 'john.doe@student.cdil.edu',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    studentId: 1,
  },
  {
    id: 6,
    email: 'jane.smith@student.cdil.edu',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'user',
    studentId: 2,
  },
  {
    id: 7,
    email: 'michael.davis@student.cdil.edu',
    firstName: 'Michael',
    lastName: 'Davis',
    role: 'user',
    studentId: 3,
  },
  {
    id: 8,
    email: 'emily.wilson@student.cdil.edu',
    firstName: 'Emily',
    lastName: 'Wilson',
    role: 'user',
    studentId: 4,
  },
  {
    id: 9,
    email: 'david.martinez@student.cdil.edu',
    firstName: 'David',
    lastName: 'Martinez',
    role: 'user',
    studentId: 5,
  },
  {
    id: 10,
    email: 'sophia.anderson@student.cdil.edu',
    firstName: 'Sophia',
    lastName: 'Anderson',
    role: 'user',
    studentId: 6,
  },
];

export async function getCurrentUser(): Promise<CurrentUser> {
  const userId = await getUserIdFromCookie();

  if (!userId) {
    redirect('/login');
  }

  const user = MOCK_USERS.find((u) => u.id === userId);

  if (!user) {
    redirect('/login');
  }

  return user;
}

export async function getUserOrNull(): Promise<CurrentUser | null> {
  const userId = await getUserIdFromCookie();

  if (!userId) {
    return null;
  }

  const user = MOCK_USERS.find((u) => u.id === userId);

  return user || null;
}

export function getAllMockUsers(): CurrentUser[] {
  return MOCK_USERS;
}

export function isStudent(user: CurrentUser): boolean {
  return user.role === 'user';
}

export function isInstructor(user: CurrentUser): boolean {
  return user.role === 'admin' || user.role === 'superadmin';
}

export function isSuperAdmin(user: CurrentUser): boolean {
  return user.role === 'superadmin';
}
