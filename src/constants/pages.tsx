import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
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
import { getAllWorkspaces } from '@/redux/feature/workspace/workspace-thunk';
import { useEffect } from 'react';

export interface ProjectView {
  id: string;
  name: string;
  icon: React.ReactNode;
  path: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  path: string;
  color?: string;
  taskCount?: number;
  icon?: React.ReactNode;
  views?: ProjectView[];
}

export interface NavItem {
  icon?: React.ReactNode;
  name: string;
  path?: string;
  color?: string;
  badge?: number;
  subItems?: NavItem[];
  projects?: Project[];
  isWorkspace?: boolean;
}

// Owner pages
export const ownerPages: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Organization',
    path: '/organization',
  },
];

export const useMemberPages = (): NavItem[] => {
  const dispatch = useAppDispatch();
  // const { workspaces } = useAppSelector((state: any) => state.workspace);
  const { user, organization } = useAppSelector((state) => state.auth);


  useEffect(() => {
    if (organization?.id) {
      dispatch(
        getAllWorkspaces({
          organizationId: organization.id,
        }),
      );
    }
  }, [dispatch, organization?.id, ]);

  const workspaces = [
    {
      id: 'ws-1',
      name: 'Product Development',
      slug: 'product-development',
      color: '#7B68EE',
      projects: [
        {
          id: 'p1',
          name: 'Website Redesign',
          slug: 'website-redesign',
          color: '#4ECDC4',
          taskCount: 12,
        },
        {
          id: 'p2',
          name: 'Mobile App',
          slug: 'mobile-app',
          color: '#FF6B6B',
          taskCount: 8,
        },
      ],
    },
    {
      id: 'ws-2',
      name: 'Marketing Team',
      slug: 'marketing-team',
      color: '#FF8C00',
      projects: [
        {
          id: 'p3',
          name: 'Ad Campaign',
          slug: 'ad-campaign',
          color: '#FFD93D',
          taskCount: 5,
        },
      ],
    },
  ];

  const workspaceNavItems: NavItem[] = Array.isArray(workspaces)
    ? workspaces.map((ws: any) => ({
        icon: <ListIcon />,
        name: ws.name,
        path: `/workspaces/${ws.slug}`,
        color: ws.color || '#7B68EE',
        isWorkspace: true,
        projects:
          ws.projects?.map((project: any) => ({
            id: project.id || project.slug,
            name: project.name,
            slug: project.slug,
            path: `/workspaces/${ws.slug}/projects/${project.slug}`,
            color: project.color || '#4ECDC4',
            taskCount: project.taskCount || 0,
            icon: <BoxCubeIcon />,
            views: [
              {
                id: 'list',
                name: 'List',
                icon: <TableIcon />,
                path: `/workspaces/${ws.slug}/projects/${project.slug}/list`,
              },
              {
                id: 'board',
                name: 'Board',
                icon: <GridIcon />,
                path: `/workspaces/${ws.slug}/projects/${project.slug}/board`,
              },
              {
                id: 'calendar',
                name: 'Calendar',
                icon: <CalenderIcon />,
                path: `/workspaces/${ws.slug}/projects/${project.slug}/calendar`,
              },
              {
                id: 'timeline',
                name: 'Timeline',
                icon: <TimeIcon />,
                path: `/workspaces/${ws.slug}/projects/${project.slug}/timeline`,
              },
            ],
          })) || [],
      }))
    : [];

  return [
    { icon: <GridIcon />, name: 'Dashboard', path: '/dashboard' },
    { icon: <BoltIcon />, name: 'My Tasks', path: '/task' },
    { icon: <CalenderIcon />, name: 'Calendar', path: '/calendar' },
    { icon: <TimeIcon />, name: 'Time Tracking', path: '/time-tracking' },
    { icon: <DocsIcon />, name: 'Docs', path: '/docs' },
    { icon: <GridIcon />, name: 'Goals', path: '/goals' },
    { icon: <EmployeeIcon />, name: 'Members', path: '/members' },
    { icon: <PageIcon />, name: 'Reports', path: '/reports' },
    {
      icon: <BellIcon />,
      name: 'Notification',
      path: '/notification',
      badge: 3,
    },
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
    ...workspaceNavItems,
    // { icon: <PieChartIcon />, name: 'Spaces', path: '/spaces' },
    // {
    //   icon: <BoxCubeIcon />,
    //   name: 'Projects',
    //   subItems: [
    //     { name: 'All Projects', path: '/projects' },
    //     { name: 'Create Project', path: '/projects/create' },
    //     { name: 'Archived', path: '/projects/archived' },
    //   ],
    // },
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
};

// Member pages
// export const memberPages: NavItem[] = [
//   { icon: <GridIcon />, name: 'Dashboard', path: '/dashboard' },
//   { icon: <BoltIcon />, name: 'My Tasks', path: '/task' },
//   { icon: <CalenderIcon />, name: 'Calendar', path: '/calendar' },
//   { icon: <TimeIcon />, name: 'Time Tracking', path: '/time-tracking' },
//   { icon: <DocsIcon />, name: 'Docs', path: '/docs' },
//   { icon: <GridIcon />, name: 'Goals', path: '/goals' },
//   { icon: <EmployeeIcon />, name: 'Members', path: '/members' },
//   { icon: <PageIcon />, name: 'Reports', path: '/reports' },
//   { icon: <BellIcon />, name: 'Notification', path: '/notification' },
//   {
//     icon: <HandshakeIcon />,
//     name: 'Teams',
//     subItems: [
//       { name: 'All Teams', path: '/teams/all' },
//       { name: 'HR Team', path: '/teams/hr' },
//       { name: 'Dev Team', path: '/teams/dev' },
//       { name: 'Sales Team', path: '/teams/sales' },
//     ],
//   },
//   {
//     icon: <ListIcon />,
//     name: 'Workspaces',
//     subItems: [
//       { name: 'All Workspaces', path: '/workspaces' },
//       { name: 'Invicta Workspace', path: '/workspaces/invicta' },
//     ],
//   },
//   { icon: <PieChartIcon />, name: 'Spaces', path: '/spaces' },
//   {
//     icon: <BoxCubeIcon />,
//     name: 'Projects',
//     subItems: [
//       { name: 'All Projects', path: '/projects' },
//       { name: 'Create Project', path: '/projects/create' },
//       { name: 'Archived', path: '/projects/archived' },
//     ],
//   },
//   {
//     icon: <EmployeeIcon />,
//     name: 'Employee',
//     subItems: [
//       { name: 'Designation', path: '/designation' },
//       { name: 'Department', path: '/department' },
//       { name: 'Employee', path: '/employee' },
//     ],
//   },
//   { icon: <ChatIcon />, name: 'Chat', path: '/chat' },
//   { icon: <UserCircleIcon />, name: 'User Profile', path: '/profile' },
//   { icon: <PlugInIcon />, name: 'Settings', path: '/settings' },
// ];
