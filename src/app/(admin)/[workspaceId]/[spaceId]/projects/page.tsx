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
import { getAllSpaces } from '@/redux/feature/space/space-thunk';
import { useParams } from 'next/navigation';

export default function Projects() {
  const params = useParams();
  const spaceId = params.spaceId;
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const { organization } = useAppSelector((state) => state.auth);
  const { projects, loading, total } = useAppSelector((state) => state.project);
  const { spaces } = useAppSelector((state) => state.space);

  const [editingRecord, setEditingRecord] = useState<Project | null>(null);
  const [selectedSpace, setSelectedSpace] = useState<any>(spaceId);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { isOpen, openModal, closeModal } = useModal();
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  const { getColumnSearchProps } = useColumnSearch<Project>();

  // Load workspaces on component mount
  useEffect(() => {
    if (organization?.id) {
      dispatch(
        getAllSpaces({
          organizationId: organization.id,
          page: 1,
          limit: 100,
        }),
      );
    }
  }, [dispatch, organization?.id]);

  // Set default workspace when workspaces are loaded
  useEffect(() => {
    if (spaces.length > 0 && !selectedSpace) {
      setSelectedSpace(spaces[0].id);
    }
  }, [spaces, selectedSpace]);

  // Load projects when workspace is selected
  useEffect(() => {
    if (selectedSpace) {
      dispatch(getAllProjects({ spaceId: selectedSpace }));
    }
  }, [dispatch, selectedSpace]);

  const handleEdit = (record: Project) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      toast.success('Project deleted successfully!');
      if (selectedSpace) {
        dispatch(getAllProjects({ spaceId: selectedSpace }));
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
    () =>
      getProjectColumns(
        getColumnSearchProps,
        handleEdit,
        handleDelete,
        handleViewDetails,
        handleManageMembers,
      ),
    [getColumnSearchProps],
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

      if (selectedSpace) {
        dispatch(getAllProjects({ spaceId: selectedSpace }));
      }
      closeModal();
      formRef.current?.resetForm();
      setEditingRecord(null);
    } catch (error) {
      toast.error(`Failed to ${editingRecord ? 'update' : 'create'} project.`);
    }
  };

  // const handleWorkspaceChange = (spaceId: string) => {
  //   setSelectedSpace(spaceId);
  //   setPagination({ current: 1, pageSize: 10 });
  // };

  const spaceOptions = spaces.map((space) => ({
    label: space.name,
    value: space.id,
  }));

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Project Management" />

      {/* <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Space:
          </span>
          <Select
            placeholder="Select workspace"
            value={selectedSpace}
            onChange={handleWorkspaceChange}
            options={spaceOptions}
            className="w-64"
            loading={!spaces.length}
          />
        </div>
      </div> */}

      {selectedSpace && (
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
              workspaceId={selectedSpace}
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
            onChange: (page: any, pageSize: any) => {
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
          if (selectedSpace) {
            dispatch(getAllProjects({ spaceId: selectedSpace }));
          }
        }}
      />

      {!selectedSpace && spaces.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No workspaces found. Please create a workspace first.
          </p>
        </div>
      )}
    </div>
  );
}
