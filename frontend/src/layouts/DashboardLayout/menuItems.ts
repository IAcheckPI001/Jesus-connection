import type { LucideIcon } from 'lucide-react';
import { CalendarCheck2, CircleHelp, UsersRound } from 'lucide-react';

export type MenuItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const menuItems: MenuItem[] = [
  { label: 'Điểm danh', to: '/dashboard/diem-danh', icon: CalendarCheck2 },
  { label: 'Thiếu nhi', to: '/dashboard/thieu-nhi', icon: UsersRound },
  { label: 'Hỗ trợ', to: '/dashboard/ho-tro', icon: CircleHelp },
];
