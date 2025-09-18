import {
  BellIcon,
  BoltIcon,
  BoxCubeIcon,
  CalenderIcon,
  ChatIcon,
  ChevronDownIcon,
  DocsIcon,
  EmployeeIcon,
  GridIcon,
  HandshakeIcon,
  HorizontaLDots,
  ListIcon,
  OrganizationIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  TimeIcon,
  UserCircleIcon,
} from '@/icons/index'; // adjust imports

export interface NavItem {
  icon?: React.ReactNode;
  name: string;
  path?: string;
  subItems?: { name: string; path: string }[];
}

// Owner pages
export const ownerPages: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Organization',
    path: '/organization',
  },
];

// Member pages
export const memberPages: NavItem[] = [
  { icon: <GridIcon />, name: 'Dashboard', path: '/dashboard' },
  { icon: <BoltIcon />, name: 'My Tasks', path: '/task' },
  { icon: <CalenderIcon />, name: 'Calendar', path: '/calendar' },
  { icon: <TimeIcon />, name: 'Time Tracking', path: '/time-tracking' },
  { icon: <DocsIcon />, name: 'Docs', path: '/docs' },
  { icon: <GridIcon />, name: 'Goals', path: '/goals' },
  { icon: <EmployeeIcon />, name: 'Members', path: '/members' },
  { icon: <PageIcon />, name: 'Reports', path: '/reports' },
  { icon: <BellIcon />, name: 'Notification', path: '/notification' },
  {
    icon: <HandshakeIcon />,
    name: 'Teams',
    subItems: [
      { name: 'All Teams', path: '/teams/all' },
      { name: 'HR Team', path: '/teams/hr' },
      { name: 'Dev Team', path: '/teams/dev' },
      { name: 'Sales Team', path: '/teams/sales' },
    ],
  },
  {
    icon: <ListIcon />,
    name: 'Workspaces',
    subItems: [
      { name: 'All Workspaces', path: '/workspaces' },
      { name: 'Invicta Workspace', path: '/workspaces/invicta' },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: 'Projects',
    subItems: [
      { name: 'All Projects', path: '/projects' },
      { name: 'Create Project', path: '/projects/create' },
      { name: 'Archived', path: '/projects/archived' },
    ],
  },
  {
    icon: <EmployeeIcon />,
    name: 'Employee',
    subItems: [
      { name: 'Designation', path: '/designation' },
      { name: 'Department', path: '/department' },
      { name: 'Employee', path: '/employee' },
    ],
  },
  { icon: <ChatIcon />, name: 'Chat', path: '/chat' },
  { icon: <UserCircleIcon />, name: 'User Profile', path: '/profile' },
  { icon: <PlugInIcon />, name: 'Settings', path: '/settings' },
];

// Others pages (UI Elements, Forms, Tables, Pages)
export const othersItems: NavItem[] = [
  {
    icon: <BoxCubeIcon />,
    name: 'UI Elements',
    subItems: [
      { name: 'Alerts', path: '/alerts' },
      { name: 'Avatar', path: '/avatars' },
      { name: 'Badge', path: '/badge' },
      { name: 'Buttons', path: '/buttons' },
      { name: 'Images', path: '/images' },
      { name: 'Videos', path: '/videos' },
    ],
  },
  {
    name: 'Forms',
    icon: <ListIcon />,
    subItems: [{ name: 'Form Elements', path: '/form-elements' }],
  },
  {
    name: 'Tables',
    icon: <TableIcon />,
    subItems: [{ name: 'Basic Tables', path: '/basic-tables' }],
  },
  {
    name: 'Pages',
    icon: <PageIcon />,
    subItems: [{ name: 'Blank Page', path: '/blank' }],
  },
];
