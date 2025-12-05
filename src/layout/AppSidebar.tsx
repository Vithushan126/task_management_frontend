'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { usePathname, useRouter } from 'next/navigation';
import { Hash, ChevronRight, ChevronDown } from 'lucide-react';
import { useSidebar } from '../context/SidebarContext';
import { ChevronDownIcon, HorizontaLDots, PlusIcon } from '../icons/index';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import { useMemberPages, NavItem, ownerPages } from '@/constants/pages';
import { Modal, Tooltip } from 'antd';
import WorkspaceForm from '@/app/(admin)/workspaces/WorkspaceForm';
import { useModal } from '@/hooks/useModal';
import {
  createWorkspace,
  getAllWorkspaces,
} from '@/redux/feature/workspace/workspace-thunk';
import SpaceForm from '@/app/(admin)/[workspaceId]/spaces/SpaceForm';
import { createSpace } from '@/redux/feature/space/space-thunk';
import ProjectForm from '@/app/(admin)/[workspaceId]/[spaceId]/projects/ProjectForm';
import { createProject } from '@/redux/feature/project/project-thunk';

const AppSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, organization, isAuthenticated, loading } = useAppSelector(
    (state: any) => state.auth,
  );
  useEffect(() => {
    if (organization?.id) {
      dispatch(getAllWorkspaces({ organizationId: organization.id }));
    }
  }, [dispatch, organization?.id]);

  const memberPages = useMemberPages();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const navItems = user?.role === 'super_admin' ? ownerPages : memberPages;

  const [expandedWorkspaces, setExpandedWorkspaces] = useState<
    Record<string, boolean>
  >({});

  const [expandedSpaces, setExpandedSpaces] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedProjects, setExpandedProjects] = useState<
    Record<string, boolean>
  >({});
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main' | 'others';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {},
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const workspaceFormRef = useRef<any>(null); // ref to reset form
  const spaceFormRef = useRef<any>(null); // ref to reset form
  const projectFormRef = useRef<any>(null); // ref to reset form
  const [workspaceId, setWorkspaceId] = useState('');
  const [spaceId, setSpaceId] = useState('');

  const {
    isOpen: isWorkspaceModalOpen,
    openModal: openWorkspaceModal,
    closeModal: closeWorkspaceModal,
  } = useModal(false);
  const {
    isOpen: isSpaceModalOpen,
    openModal: openSpaceModal,
    closeModal: closeSpaceModal,
  } = useModal(false);
  const {
    isOpen: isProjectModalOpen,
    openModal: openProjectModal,
    closeModal: closeProjectModal,
  } = useModal(false);

  // const isActive = (path: string) => path === pathname;
  const isActive = useCallback(
    (path?: string) => {
      if (!path) return false;
      return path === pathname;
    },
    [pathname],
  );

  // ✅ Toggle workspace — only one expanded at a time
  const toggleWorkspace = (workspaceId: string) => {
    console.log('workspaceId', workspaceId);

    setExpandedWorkspaces((prev) => {
      const newState: Record<string, boolean> = {};
      // collapse all, expand only the clicked one
      Object.keys(prev).forEach((id) => (newState[id] = false));
      newState[workspaceId] = !prev[workspaceId];
      return newState;
    });
  };

  // ✅ Toggle space — only within that workspace
  const toggleSpace = (spaceId: string) => {
    setExpandedSpaces((prev) => ({
      ...prev,
      [spaceId]: !prev[spaceId],
    }));
  };

  // ✅ Toggle project — only within that space
  const toggleProject = (projectId: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const handleSubmenuToggle = (index: number, menuType: 'main' | 'others') => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleCloseWorkspaceModal = () => {
    closeWorkspaceModal();
    workspaceFormRef.current?.resetForm?.();
  };

  const handleCloseSpaceModal = () => {
    closeSpaceModal();
    spaceFormRef.current?.resetForm?.();
    setWorkspaceId('');
  };

  const handleCloseProjectModal = () => {
    closeProjectModal();
    projectFormRef.current?.resetForm?.();
    setSpaceId('');
  };

  const handleWorkspaceSubmit = async (values: any) => {
    try {
      await dispatch(
        createWorkspace({
          ...values,
          organizationId: organization?.id,
        }),
      ).unwrap();

      dispatch(
        getAllWorkspaces({
          organizationId: organization.id,
        }),
      );
      toast.success('Workspace created successfully!');
      handleCloseWorkspaceModal();
    } catch (error: any) {
      console.error('Workspace creation failed:', error);
      toast.error(
        error?.message || 'Failed to create workspace. Please try again.',
      );
    }
  };

  const handleSpaceSubmit = async (values: any) => {
    try {
      await dispatch(createSpace(values)).unwrap();
      toast.success('Space created successfully!');
      handleCloseSpaceModal();
    } catch (error: any) {
      console.error('Space creation failed:', error);
      toast.error(
        error?.message || 'Failed to create Space. Please try again.',
      );
    }
  };

  const handleProjectSubmit = async (values: any) => {
    try {
      await dispatch(createProject(values)).unwrap();
      toast.success('Project created successfully!');
      handleCloseProjectModal();
    } catch (error: any) {
      console.error('Project creation failed:', error);
      toast.error(
        error?.message || 'Failed to create Project. Please try again.',
      );
    }
  };

  useEffect(() => {
    let submenuMatched = false;
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ type: 'main', index });
            submenuMatched = true;
          }
        });
      }

      // Auto-expand workspace if current path matches
      if (nav.isWorkspace && nav.projects) {
        console.log(nav.isWorkspace);

        nav.projects.forEach((project) => {
          if (pathname.includes(project.slug)) {
            setExpandedWorkspaces((prev) => ({ ...prev, [nav.name]: true }));
            // setExpandedProjects((prev) => ({ ...prev, [project.id]: true }));
          }
        });
      }
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, navItems, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderWorkspaceItem = (workspace: any, index: number) => {
    const isWorkspaceExpanded = expandedWorkspaces[workspace.id];

    const showContent = isExpanded || isHovered || isMobileOpen;

    return (
      <li key={workspace.id}>
        {/* Workspace Header */}
        <div
          onClick={() => toggleWorkspace(workspace.id)}
          className={`menu-item group ${
            isActive(workspace.slug) ? 'menu-item-active' : 'menu-item-inactive'
          } ${!showContent ? 'lg:justify-center' : 'lg:justify-start'}`}
        >
          {showContent ? (
            isWorkspaceExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500 shrink-0" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
            )
          ) : null}

          {workspace.color && showContent && (
            <div
              className="w-3 h-3 rounded shrink-0"
              style={{ backgroundColor: workspace.color }}
            />
          )}

          {!showContent && (
            <span
              className={`${
                isActive(workspace.slug)
                  ? 'menu-item-icon-active'
                  : 'menu-item-icon-inactive'
              }`}
            >
              {workspace.icon}
            </span>
          )}

          {showContent && (
            <div
              onClick={() => router.push(`/${workspace.id}/spaces`)}
              className="menu-item-text flex-1 text-left"
            >
              {workspace.name}
            </div>
          )}

          {showContent && (
            <Tooltip title="Add Space">
              <button
                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  openSpaceModal();
                  setWorkspaceId(workspace.id);
                }}
              >
                <PlusIcon className="w-3 h-3" />
              </button>
            </Tooltip>
          )}
        </div>

        {/* Spaces List */}
        {isWorkspaceExpanded && showContent && workspace.spaces && (
          <div className="ml-6 mt-1 space-y-0.5">
            {workspace.spaces.map((space: any) => {
              const isSpaceExpanded = expandedSpaces[space.id];
              return (
                <div key={space.id}>
                  {/* Space Header */}
                  <div
                    onClick={() => toggleSpace(space.id)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm group ${
                      isActive(space.slug)
                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {isSpaceExpanded ? (
                      <ChevronDown className="w-3 h-3 shrink-0" />
                    ) : (
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    )}

                    <Hash
                      className="w-3 h-3 shrink-0"
                      style={{ color: space.color }}
                    />

                    <div
                      onClick={() =>
                        router.push(`/${workspace.id}/${space.id}/projects`)
                      }
                      className="flex-1 text-left truncate cursor-pointer"
                    >
                      {space.name}
                    </div>

                    <Tooltip title="Add Project">
                      <button
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          openProjectModal();
                          setSpaceId(space.id);
                        }}
                      >
                        <PlusIcon className="w-3 h-3" />
                      </button>
                    </Tooltip>
                  </div>

                  {/* Projects inside Space */}
                  {isSpaceExpanded && space.projects && (
                    <div className="ml-5 mt-1 space-y-0.5">
                      {space.projects.map((project: any) => {
                        const isProjectExpanded = expandedProjects[project.id];

                        return (
                          <div key={project.id}>
                            <button
                              onClick={() => toggleProject(project.id)}
                              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm group ${
                                isActive(project.slug)
                                  ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                            >
                              {isProjectExpanded ? (
                                <ChevronDown className="w-3 h-3 shrink-0" />
                              ) : (
                                <ChevronRight className="w-3 h-3 shrink-0" />
                              )}

                              <Hash
                                className="w-3 h-3 shrink-0"
                                style={{ color: project.color }}
                              />

                              <span className="flex-1 text-left truncate">
                                {project.name}
                              </span>

                              {project.taskCount !== undefined &&
                                project.taskCount > 0 && (
                                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
                                    {project.taskCount}
                                  </span>
                                )}
                            </button>

                            {/* Project Views */}
                            {isProjectExpanded && project.views && (
                              <div className="ml-5 mt-1 space-y-0.5">
                                {project.views.map((view: any) => (
                                  <Link
                                    key={view.id}
                                    href={view.path}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs ${
                                      isActive(view.path)
                                        ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                                        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                  >
                                    <span className="shrink-0">
                                      {view.icon}
                                    </span>
                                    <span>{view.name}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </li>
    );
  };

  const renderRegularItem = (
    nav: NavItem,
    index: number,
    menuType: 'main' | 'others',
  ) => {
    const showContent = isExpanded || isHovered || isMobileOpen;

    return (
      <li key={nav.name}>
        {nav.subItems ? (
          <>
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? 'menu-item-active'
                  : 'menu-item-inactive'
              } cursor-pointer ${
                !showContent ? 'lg:justify-center' : 'lg:justify-start'
              }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {showContent && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {showContent && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? 'rotate-180 text-brand-500'
                      : ''
                  }`}
                />
              )}
            </button>

            {showContent && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : '0px',
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path!}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path)
                            ? 'menu-dropdown-item-active'
                            : 'menu-dropdown-item-inactive'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          nav.path && (
            <Link
              href={nav.path}
              className={`menu-item group ${
                isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
              }`}
            >
              <span
                className={`${
                  isActive(nav.path)
                    ? 'menu-item-icon-active'
                    : 'menu-item-icon-inactive'
                }`}
              >
                {nav.icon}
              </span>
              {showContent && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {nav.badge && showContent && (
                <span className="ml-auto bg-brand-500 text-white text-xs rounded-full px-2 py-0.5">
                  {nav.badge}
                </span>
              )}
            </Link>
          )
        )}
      </li>
    );
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: 'main' | 'others',
  ) => {
    const regularItems = navItems.filter((item) => !item.isWorkspace);
    const workspaceItems = navItems.filter((item) => item.isWorkspace);

    console.log('workspaceItems', workspaceItems);

    return (
      <>
        <ul className="flex flex-col gap-1">
          {regularItems.map((nav, index) =>
            renderRegularItem(nav, index, menuType),
          )}
        </ul>

        {/* {workspaceItems.length > 0 && ( */}
        <div className="mt-6">
          <div className="flex items-center justify-between px-3 py-2 mb-2">
            {(isExpanded || isHovered || isMobileOpen) && (
              <>
                <Link
                  href="/workspaces"
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase cursor-pointer"
                >
                  Workspaces
                </Link>
                <Tooltip title="Create Workspace">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openWorkspaceModal();
                    }}
                    className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded flex items-center justify-center"
                  >
                    <PlusIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </Tooltip>
              </>
            )}
          </div>
          <ul className="flex flex-col gap-1 cursor-pointer">
            {workspaceItems.map((nav, index) =>
              renderWorkspaceItem(nav, index),
            )}
          </ul>
        </div>
        {/* )} */}
      </>
    );
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
        ${
          isExpanded || isMobileOpen
            ? 'w-[290px]'
            : isHovered
            ? 'w-[290px]'
            : 'w-[90px]'
        }
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
        }`}
      >
        <Link href="/dashboard">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              {/* {/* <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
              <svg
                viewBox="0 0 350 89.89735903840513"
                className="w-[100px] sm:w-[150px] md:w-[200px] text-black dark:text-white"
                fill="currentColor"
              >
                <defs id="SvgjsDefs1446"></defs>
                <g
                  id="SvgjsG1447"
                  transform="matrix(4.427017164592548,0,0,4.427017164592548,-6.90614599570685,-23.374660001738953)"
                >
                  <path d="M1.56 20 l0 -13.66 q0.62 -0.12 1.6 -0.12 t1.62 0.12 l0 13.66 q-0.64 0.12 -1.62 0.12 t-1.6 -0.12 z M16.14 13.4 l0 4.1 q0 1.32 0.48 1.98 q-0.76 0.68 -1.82 0.68 q-1.04 0 -1.42 -0.48 t-0.38 -1.46 l0 -4.26 q0 -0.68 -0.18 -1 t-0.7 -0.32 q-0.3 0 -0.68 0.16 t-0.78 0.52 l0 6.68 q-0.34 0.06 -0.74 0.09 t-0.82 0.03 t-0.82 -0.03 t-0.74 -0.09 l0 -9.98 l0.14 -0.14 l1.18 0 q1.22 0 1.64 1.2 q1.4 -1.24 2.78 -1.24 q1.4 0 2.13 0.97 t0.73 2.59 z M22.080000000000002 17.62 l1.74 -7.58 q0.56 -0.12 1.26 -0.12 q0.86 0 1.5 0.24 l0.1 0.14 q-2.04 7.44 -2.78 9.7 q-1.02 0.12 -2.15 0.12 t-1.61 -0.31 t-0.74 -1.19 l-2.4 -8.36 q0.98 -0.42 1.74 -0.42 t1.18 0.33 t0.62 1.13 l0.9 3.74 q0.1 0.38 0.44 2.42 q0.02 0.16 0.2 0.16 z M31.720000000000002 12.32 l0 7.68 q-0.34 0.06 -0.74 0.09 t-0.82 0.03 t-0.83 -0.03 t-0.75 -0.09 l0 -6.62 q0 -1.16 -0.94 -1.16 l-0.3 0 q-0.12 -0.38 -0.12 -1.06 q0 -0.66 0.12 -1.12 q0.52 -0.04 0.96 -0.07 t0.8 -0.03 l0.44 0 q1.02 0 1.6 0.64 t0.58 1.74 z M28.220000000000002 6 q0.58 -0.32 1.5 -0.32 q0.94 0 1.46 0.32 q0.24 0.54 0.24 1.16 t-0.24 1.16 q-0.58 0.3 -1.52 0.3 t-1.44 -0.3 q-0.24 -0.54 -0.24 -1.16 t0.24 -1.16 z M39.06 14.440000000000001 l0 -0.26 q0 -1.12 -0.24 -1.63 t-0.9 -0.51 q-0.7 0 -0.98 0.69 t-0.28 2.29 q0 0.8 0.11 1.34 t0.32 0.87 t0.53 0.48 t0.76 0.15 q0.46 0 1.02 -0.2 t1.2 -0.64 q0.18 0.1 0.37 0.29 t0.35 0.43 t0.28 0.51 t0.18 0.51 q-0.66 0.7 -1.72 1.12 t-2.16 0.42 q-2.14 0 -3.28 -1.4 t-1.14 -3.98 q0 -1.32 0.37 -2.3 t0.98 -1.62 t1.4 -0.96 t1.65 -0.32 q0.88 0 1.61 0.24 t1.26 0.68 t0.82 1.05 t0.29 1.35 q0 0.84 -0.49 1.18 t-1.21 0.34 q-0.6 0 -1.1 -0.12 z M49.080000000000005 8.98 l0.02 1.48 l0 9.54 q-0.68 0.12 -1.62 0.12 t-1.58 -0.12 l0 -11.02 l-1.28 0.02 l-2.06 0 q-0.12 -0.58 -0.12 -1.33 t0.12 -1.33 l9.9 0 q0.16 0.52 0.16 1.26 t-0.4 1.07 t-1.28 0.33 l-0.58 0 l-1.26 -0.02 l-0.02 0 z M60.86000000000001 18.56 q-0.1 0.42 -0.38 0.9 t-0.58 0.7 q-1.4 -0.04 -2.16 -1.06 q-1.3 1.2 -2.82 1.2 q-0.78 0 -1.36 -0.25 t-0.98 -0.67 t-0.6 -0.97 t-0.2 -1.15 q0 -0.86 0.31 -1.51 t0.85 -1.08 t1.26 -0.65 t1.54 -0.22 q0.46 0 0.81 0.01 t0.61 0.03 l0 -0.38 q0 -1.26 -1.3 -1.26 q-0.84 0 -2.94 0.64 q-0.6 -0.7 -0.76 -2.18 q0.48 -0.18 1.07 -0.34 t1.21 -0.28 t1.22 -0.19 t1.08 -0.07 q0.7 0 1.35 0.2 t1.14 0.61 t0.78 1.06 t0.29 1.55 l0 4.06 q0 0.92 0.56 1.3 z M54.82000000000001 17.06 q0 0.94 1.08 0.94 q0.56 0 1.26 -0.58 l0 -1.6 q-0.4 -0.02 -0.67 -0.03 t-0.41 -0.01 q-1.26 0 -1.26 1.28 z M61.84 19.32 q0.02 -0.52 0.27 -1.14 t0.59 -0.98 q1.6 0.84 2.78 0.84 q0.56 0 0.86 -0.19 t0.3 -0.51 q0 -0.6 -0.92 -0.9 l-1.1 -0.42 q-2.5 -0.92 -2.5 -3 q0 -1.52 1.05 -2.41 t2.83 -0.89 q0.88 0 1.94 0.25 t1.74 0.59 q0.04 0.56 -0.22 1.23 t-0.64 0.95 q-1.68 -0.76 -2.8 -0.76 q-0.4 0 -0.61 0.18 t-0.21 0.46 q0 0.48 0.76 0.76 l1.24 0.44 q2.66 0.94 2.66 3.22 q0 1.5 -1.1 2.38 t-3.14 0.88 t-3.78 -0.98 z M79.16000000000001 16.02 l0.5 1.46 q0.4 1.32 0.96 1.7 q-0.88 0.98 -2.1 0.98 q-0.66 0 -1 -0.31 t-0.6 -1.09 l-0.6 -1.72 q-0.2 -0.62 -0.46 -0.83 t-0.7 -0.21 t-0.62 0.02 l0 3.98 q-0.66 0.12 -1.52 0.12 t-1.52 -0.12 l0 -14.58 l0.14 -0.14 l1.2 0 q0.94 0 1.32 0.42 t0.38 1.46 l0 6.28 l0.32 0 q0.36 0 0.56 -0.36 l1.04 -2 q0.56 -1.14 1.76 -1.14 q0.58 0 1.74 0.04 l0.12 0.16 l-1.54 2.98 q-0.4 0.76 -1.02 1.18 q1.2 0.44 1.64 1.72 z"></path>
                </g>
                <g
                  id="SvgjsG1448"
                  transform="matrix(0.9339560086752174,0,0,0.9339560086752174,34.12208107573144,70.88192149999094)"
                >
                  <path d="M8.32 5.48 c2.1066 0 3.8634 0.69998 5.27 2.1 s2.11 3.18 2.11 5.34 c0 1.3733 -0.31334 2.63 -0.94 3.77 s-1.51 2.0366 -2.65 2.69 s-2.4034 0.98 -3.79 0.98 c-1.3733 0 -2.6266 -0.32334 -3.76 -0.97 s-2.02 -1.54 -2.66 -2.68 s-0.96 -2.4034 -0.96 -3.79 c0 -2.1066 0.69 -3.8734 2.07 -5.3 s3.15 -2.14 5.31 -2.14 z M2.98 12.92 c0 1.6 0.49998 2.94 1.5 4.02 s2.28 1.62 3.84 1.62 c1.5333 0 2.8066 -0.53334 3.82 -1.6 s1.52 -2.4134 1.52 -4.04 c0 -1.6133 -0.5 -2.9566 -1.5 -4.03 s-2.2866 -1.61 -3.86 -1.61 c-1.52 0 -2.7866 0.53334 -3.8 1.6 s-1.52 2.4134 -1.52 4.04 z M23.54 5.84 c1.3867 0 2.4734 0.34666 3.26 1.04 s1.18 1.6667 1.18 2.92 c0 0.94666 -0.32334 1.7733 -0.97 2.48 s-1.4767 1.1267 -2.49 1.26 l-0.02 0 l4.02 6.46 l-2.4 0 l-3.6 -6.24 l-2.14 0 l0 6.24 l-1.92 0 l0 -14.16 l5.08 0 z M22.98 12.08 c1 0 1.7433 -0.18336 2.23 -0.55002 s0.73 -0.94332 0.73 -1.73 c0 -1.52 -0.98666 -2.28 -2.96 -2.28 l-2.6 0 l0 4.56 l2.6 0 z M37.2 5.48 c2.36 0 4.1134 0.6133 5.26 1.84 l-1.36 1.46 c-1.0533 -1 -2.36 -1.5 -3.92 -1.5 s-2.84 0.53666 -3.84 1.61 s-1.5 2.4166 -1.5 4.03 c0 1.6267 0.53 2.9734 1.59 4.04 s2.3634 1.6 3.91 1.6 c1.4667 0 2.6266 -0.24666 3.48 -0.74 l0 -3.94 l-3.14 0 l0 -1.8 l5.06 0 l0 6.98 c-0.69334 0.41334 -1.53 0.73334 -2.51 0.96 s-1.93 0.34 -2.85 0.34 c-2.2266 0 -4.0466 -0.69334 -5.46 -2.08 s-2.12 -3.1734 -2.12 -5.36 c0 -2.1066 0.69666 -3.8734 2.09 -5.3 s3.1634 -2.14 5.31 -2.14 z M52.42 5.84 l6.06 14.16 l-2.24 0 l-1.42 -3.5 l-6.74 0 l-1.4 3.5 l-2.24 0 l6.24 -14.16 l1.74 0 z M48.760000000000005 14.82 l5.36 0 l-2.64 -6.5 l-0.04 0 z M62.84 5.84 l7.8 11.64 l0.04 0 l0 -11.64 l1.92 0 l0 14.16 l-2.44 0 l-7.88 -11.64 l-0.04 0 l0 11.64 l-1.92 0 l0 -14.16 l2.52 0 z M78.16 5.84 l0 14.16 l-1.92 0 l0 -14.16 l1.92 0 z M91.08 5.84 l0 1.8 l-8.02 10.56 l8.14 0 l0 1.8 l-10.58 0 l0 -1.78 l8.06 -10.58 l-7.82 0 l0 -1.8 l10.22 0 z M102.80000000000001 5.84 l0 1.8 l-7.22 0 l0 4.22 l6.72 0 l0 1.8 l-6.72 0 l0 4.54 l7.58 0 l0 1.8 l-9.5 0 l0 -14.16 l9.14 0 z M115.5 5.48 c1.84 0 3.2 0.54006 4.08 1.6201 l-1.56 1.42 c-0.24 -0.37334 -0.58 -0.67334 -1.02 -0.9 s-0.94666 -0.34 -1.52 -0.34 c-0.82666 0 -1.49 0.20334 -1.99 0.61 s-0.75 0.93 -0.75 1.57 c0 1.0667 0.70666 1.8133 2.12 2.24 l1.78 0.58 c1 0.32 1.7633 0.76666 2.29 1.34 s0.79 1.36 0.79 2.36 c0 1.3067 -0.46334 2.3634 -1.39 3.17 s-2.1034 1.21 -3.53 1.21 c-2.04 0 -3.5466 -0.65334 -4.52 -1.96 l1.58 -1.36 c0.30666 0.48 0.72666 0.85334 1.26 1.12 s1.1133 0.4 1.74 0.4 c0.78666 0 1.4533 -0.22666 2 -0.68 s0.82 -1.0133 0.82 -1.68 c0 -0.49334 -0.16666 -0.90668 -0.5 -1.24 s-0.93334 -0.63334 -1.8 -0.9 l-1.26 -0.42 c-1.2667 -0.42666 -2.1534 -0.97 -2.66 -1.63 s-0.76 -1.51 -0.76 -2.55 c0 -1.1067 0.44666 -2.0466 1.34 -2.82 s2.0466 -1.16 3.46 -1.16 z M125.28000000000002 5.84 l4.5 10.72 l0.08 0 l4.46 -10.72 l2.86 0 l0 14.16 l-1.92 0 l0 -11.64 l-0.04 0 l-4.78 11.64 l-1.28 0 l-4.78 -11.64 l-0.04 0 l0 11.64 l-1.92 0 l0 -14.16 l2.86 0 z M146.86 5.84 l6.06 14.16 l-2.24 0 l-1.42 -3.5 l-6.74 0 l-1.4 3.5 l-2.24 0 l6.24 -14.16 l1.74 0 z M143.20000000000002 14.82 l5.36 0 l-2.64 -6.5 l-0.04 0 z M159.84000000000003 5.84 c1.3867 0 2.4734 0.34666 3.26 1.04 s1.18 1.6667 1.18 2.92 c0 0.94666 -0.32334 1.7733 -0.97 2.48 s-1.4767 1.1267 -2.49 1.26 l-0.02 0 l4.02 6.46 l-2.4 0 l-3.6 -6.24 l-2.14 0 l0 6.24 l-1.92 0 l0 -14.16 l5.08 0 z M159.28000000000003 12.08 c1 0 1.7433 -0.18336 2.23 -0.55002 s0.73 -0.94332 0.73 -1.73 c0 -1.52 -0.98666 -2.28 -2.96 -2.28 l-2.6 0 l0 4.56 l2.6 0 z M176.06 5.84 l0 1.8 l-4.56 0 l0 12.36 l-1.92 0 l0 -12.36 l-4.56 0 l0 -1.8 l11.04 0 z M176.84 17.48 c0.37334 0 0.68664 0.13342 0.93998 0.40008 s0.38 0.57332 0.38 0.91998 c0 0.38666 -0.13334 0.70332 -0.4 0.94998 s-0.57332 0.37 -0.91998 0.37 s-0.65332 -0.12666 -0.91998 -0.38 s-0.4 -0.56668 -0.4 -0.94002 s0.13334 -0.68668 0.4 -0.94002 s0.57332 -0.38 0.91998 -0.38 z M194.78 8.44 l-3.42 11.56 l-2.02 0 l-4.14 -14.16 l2 0 l3.12 11.32 l0.04 0 l3.34 -11.32 l2.2 0 l3.34 11.32 l0.04 0 l3.12 -11.32 l2 0 l-4.12 14.16 l-2.02 0 l-3.44 -11.56 l-0.04 0 z M212.74 5.48 c2.1066 0 3.8634 0.69998 5.27 2.1 s2.11 3.18 2.11 5.34 c0 1.3733 -0.31334 2.63 -0.94 3.77 s-1.51 2.0366 -2.65 2.69 s-2.4034 0.98 -3.79 0.98 c-1.3733 0 -2.6266 -0.32334 -3.76 -0.97 s-2.02 -1.54 -2.66 -2.68 s-0.96 -2.4034 -0.96 -3.79 c0 -2.1066 0.69 -3.8734 2.07 -5.3 s3.15 -2.14 5.31 -2.14 z M207.4 12.92 c0 1.6 0.49998 2.94 1.5 4.02 s2.28 1.62 3.84 1.62 c1.5333 0 2.8066 -0.53334 3.82 -1.6 s1.52 -2.4134 1.52 -4.04 c0 -1.6133 -0.5 -2.9566 -1.5 -4.03 s-2.2866 -1.61 -3.86 -1.61 c-1.52 0 -2.7866 0.53334 -3.8 1.6 s-1.52 2.4134 -1.52 4.04 z M227.96 5.84 c1.3867 0 2.4734 0.34666 3.26 1.04 s1.18 1.6667 1.18 2.92 c0 0.94666 -0.32334 1.7733 -0.97 2.48 s-1.4767 1.1267 -2.49 1.26 l-0.02 0 l4.02 6.46 l-2.4 0 l-3.6 -6.24 l-2.14 0 l0 6.24 l-1.92 0 l0 -14.16 l5.08 0 z M227.4 12.08 c1 0 1.7433 -0.18336 2.23 -0.55002 s0.73 -0.94332 0.73 -1.73 c0 -1.52 -0.98666 -2.28 -2.96 -2.28 l-2.6 0 l0 4.56 l2.6 0 z M237.02 5.84 l0 6.12 l0.16 0 l6.26 -6.12 l2.68 0 l-6.84 6.54 l7.3 7.62 l-2.8 0 l-6.6 -7.08 l-0.16 0 l0 7.08 l-1.92 0 l0 -14.16 l1.92 0 z M262.52000000000004 5.84 l0 1.8 l-6.98 0 l0 4.44 l6.5 0 l0 1.8 l-6.5 0 l0 6.12 l-1.92 0 l0 -14.16 l8.9 0 z M270.18 5.84 l6.06 14.16 l-2.24 0 l-1.42 -3.5 l-6.74 0 l-1.4 3.5 l-2.24 0 l6.24 -14.16 l1.74 0 z M266.52 14.82 l5.36 0 l-2.64 -6.5 l-0.04 0 z M282.14 5.48 c1.84 0 3.2 0.54006 4.08 1.6201 l-1.56 1.42 c-0.24 -0.37334 -0.58 -0.67334 -1.02 -0.9 s-0.94666 -0.34 -1.52 -0.34 c-0.82666 0 -1.49 0.20334 -1.99 0.61 s-0.75 0.93 -0.75 1.57 c0 1.0667 0.70666 1.8133 2.12 2.24 l1.78 0.58 c1 0.32 1.7633 0.76666 2.29 1.34 s0.79 1.36 0.79 2.36 c0 1.3067 -0.46334 2.3634 -1.39 3.17 s-2.1034 1.21 -3.53 1.21 c-2.04 0 -3.5466 -0.65334 -4.52 -1.96 l1.58 -1.36 c0.30666 0.48 0.72666 0.85334 1.26 1.12 s1.1133 0.4 1.74 0.4 c0.78666 0 1.4533 -0.22666 2 -0.68 s0.82 -1.0133 0.82 -1.68 c0 -0.49334 -0.16666 -0.90668 -0.5 -1.24 s-0.93334 -0.63334 -1.8 -0.9 l-1.26 -0.42 c-1.2667 -0.42666 -2.1534 -0.97 -2.66 -1.63 s-0.76 -1.51 -0.76 -2.55 c0 -1.1067 0.44666 -2.0466 1.34 -2.82 s2.0466 -1.16 3.46 -1.16 z M298.64 5.84 l0 1.8 l-4.56 0 l0 12.36 l-1.92 0 l0 -12.36 l-4.56 0 l0 -1.8 l11.04 0 z M299.41999999999996 17.48 c0.37334 0 0.68664 0.13342 0.93998 0.40008 s0.38 0.57332 0.38 0.91998 c0 0.38666 -0.13334 0.70332 -0.4 0.94998 s-0.57332 0.37 -0.91998 0.37 s-0.65332 -0.12666 -0.91998 -0.38 s-0.4 -0.56668 -0.4 -0.94002 s0.13334 -0.68668 0.4 -0.94002 s0.57332 -0.38 0.91998 -0.38 z" />
                </g>
              </svg>
            </>
          ) : (
            <Image
              src="/images/logo/logo-icon.svg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? 'lg:justify-center'
                    : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  'Menu'
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>
          </div>
        </nav>
      </div>

      <Modal
        open={isWorkspaceModalOpen}
        onCancel={handleCloseWorkspaceModal}
        footer={null}
        title="Create Workspace"
      >
        <WorkspaceForm
          ref={workspaceFormRef}
          onSubmit={handleWorkspaceSubmit}
          onFinishModalClose={handleCloseWorkspaceModal}
        />
      </Modal>

      <Modal
        open={isSpaceModalOpen}
        onCancel={handleCloseSpaceModal}
        footer={null}
        title="Create Space"
      >
        <SpaceForm
          ref={spaceFormRef}
          onSubmit={handleSpaceSubmit}
          onFinishModalClose={handleCloseSpaceModal}
          workspaceId={workspaceId}
        />
      </Modal>

      <Modal
        open={isProjectModalOpen}
        onCancel={handleCloseProjectModal}
        footer={null}
        title="Create Project"
      >
        <ProjectForm
          ref={spaceFormRef}
          onSubmit={handleProjectSubmit}
          onFinishModalClose={handleCloseProjectModal}
          spaceId={spaceId}
        />
      </Modal>
    </aside>
  );
};

export default AppSidebar;
