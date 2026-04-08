import { BarChart3, Bell, FileText, Home, Mail, Settings, Users } from 'lucide-react';
import type { NavGroup } from '@masan-group/shared-ui/layout';

/**
 * Sample navigation groups for the boilerplate sidebar
 * Replace with real nav data for your application
 */

export const navGroups: NavGroup[] = [
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
