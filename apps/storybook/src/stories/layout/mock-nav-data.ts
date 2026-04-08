import { Home, Settings, Users, FileText, BarChart3, Mail, Bell, LogOut } from 'lucide-react';
import type { NavGroup, UserData } from '@masan-group/shared-ui/layout';

export const sampleNavGroups: NavGroup[] = [
  {
    title: 'Main',
    items: [
      { title: 'Dashboard', url: '/', icon: Home },
      { title: 'Analytics', url: '/analytics', icon: BarChart3 },
      {
        title: 'Documents',
        icon: FileText,
        items: [
          { title: 'All Documents', url: '/documents' },
          { title: 'Shared', url: '/documents/shared' },
          { title: 'Drafts', url: '/documents/drafts', badge: '3' },
        ],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      { title: 'Users', url: '/users', icon: Users },
      { title: 'Messages', url: '/messages', icon: Mail, badge: '12' },
      { title: 'Notifications', url: '/notifications', icon: Bell },
      { title: 'Settings', url: '/settings', icon: Settings },
    ],
  },
];

export const sampleUser: UserData = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '',
};

export const sampleUserMenuItems = [
  { label: 'Settings', icon: Settings, onClick: () => console.log('Settings') },
  { label: 'Log out', icon: LogOut, onClick: () => console.log('Log out') },
];
