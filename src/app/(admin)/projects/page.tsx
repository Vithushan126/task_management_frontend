'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Select, Modal } from 'antd';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SearchableTable } from '@/components/common/table';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import { useModal } from '@/hooks/useModal';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/redux/feature/project/project-thunk';
import { getAllWorkspaces } from '@/redux/feature/workspace/workspace-thunk';
import type { Project } from '@/types/project';
import { getProjectColumns } from './columns';
import ProjectForm from './ProjectForm';
import ProjectDetailsModal from './ProjectDetailsModal';
import ProjectMembersModal from './ProjectMembersModal';

export default function Projects() {
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const { organization } = useAppSelector((state) => state.auth);
  const { projects, loading, total } = useAppSelector((state) => state.project);
  const { workspaces } = useAppSelector((state) => state.workspace);

  const [editingRecord, setEditingRecord] = useState<Project | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  
  const { isOpen, openModal, closeModal } = useModal();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);
  
  const { getColumnSearchProps } = useColumnSearch<Project>();

  // Load workspaces on component mount
  useEffect(() => {
    if (organization?.id) {
      dispatch(getAllWorkspaces({ 
        organizationId: organization.id,
        page: 1,
        limit: 100 
      }));
    }
  }, [dispatch, organization?.id]);

  // Set default workspace when workspaces are loaded
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspace]);

  // Load projects when workspace is selected
  useEffect(() => {
    if (selectedWorkspace) {
      dispatch(getAllProjects({ workspaceId: selectedWorkspace }));
    }
  }, [dispatch, selectedWorkspace]);

  const handleEdit = (record: Project) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success('Project deleted successfully!');
      if (selectedWorkspace) {
        dispatch(getAllProjects({ workspaceId: selectedWorkspace }));
      }
    } catch (error) {
      toast.error('Failed to delete project.');
    }
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setDetailsModalOpen(true);
  };

  const handleManageMembers = (project: Project) => {
    setSelectedProject(project);
    setMembersModalOpen(true);
  };

  const columns = useMemo(
    () => getProjectColumns(
      getColumnSearchProps, 
      handleEdit, 
      handleDelete, 
      handleViewDetails,
      handleManageMembers
    ),
    [getColumnSearchProps]
  );

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingRecord) {
        await dispatch(
          updateProject({ id: editingRecord.id, payload: values }),
        ).unwrap();
        toast.success('Project updated successfully!');
      } else {
        await dispatch(createProject(values)).unwrap();
        toast.success('Project created successfully!');
      }

      if (selectedWorkspace) {
        dispatch(getAllProjects({ workspaceId: selectedWorkspace }));
      }
      closeModal();
      formRef.current?.resetForm();
      setEditingRecord(null);
    } catch (error) {
      toast.error(
        `Failed to ${editingRecord ? 'update' : 'create'} project.`,
      );
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    setPagination({ current: 1, pageSize: 10 });
  };

  const workspaceOptions = workspaces.map(workspace => ({
    label: workspace.name,
    value: workspace.id,
  }));

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Project Management" />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Workspace:
          </span>
          <Select
            placeholder="Select workspace"
            value={selectedWorkspace}
            onChange={handleWorkspaceChange}
            options={workspaceOptions}
            className="w-64"
            loading={!workspaces.length}
          />
        </div>
      </div>

      {selectedWorkspace && (
        <SearchableTable
          columns={columns}
          data={projects}
          loading={loading}
          searchableField="name"
          createButtonText="Create Project"
          modalTitle={editingRecord ? 'Update Project' : 'Create Project'}
          modalContent={
            <ProjectForm
              ref={formRef}
              onSubmit={handleCreateOrUpdate}
              initialValues={editingRecord || undefined}
              workspaceId={selectedWorkspace}
              onFinishModalClose={() => {
                closeModal();
                setEditingRecord(null);
              }}
            />
          }
          isOpen={isOpen}
          openModal={() => {
            setEditingRecord(null);
            openModal();
          }}
          closeModal={() => {
            closeModal();
            setEditingRecord(null);
          }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total,
            onChange: (page:any, pageSize:any) => {
              setPagination({ current: page, pageSize: pageSize || 10 });
            },
          }}
        />
      )}

      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProject}
        open={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setSelectedProject(null);
        }}
      />

      {/* Project Members Modal */}
      <ProjectMembersModal
        project={selectedProject}
        open={membersModalOpen}
        onClose={() => {
          setMembersModalOpen(false);
          setSelectedProject(null);
        }}
        onMemberAdded={() => {
          if (selectedWorkspace) {
            dispatch(getAllProjects({ workspaceId: selectedWorkspace }));
          }
        }}
      />

      {!selectedWorkspace && workspaces.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No workspaces found. Please create a workspace first.
          </p>
        </div>
      )}
    </div>
  );
}
