import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface MenuItem {
  id: string;
  label: string;
  icon: IconDefinition;
  href: string;
  roles: UserRole[];
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface SidebarProps {
  userRole: UserRole;
  userName?: string;
  userAvatar?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}
