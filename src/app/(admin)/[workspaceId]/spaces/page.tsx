'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Select } from 'antd';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SearchableTable } from '@/components/common/table';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import { useModal } from '@/hooks/useModal';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  getAllSpaces,
  createSpace,
  updateSpace,
  deleteSpace,
  archiveSpace,
  unarchiveSpace,
} from '@/redux/feature/space/space-thunk';
import { getAllWorkspaces } from '@/redux/feature/workspace/workspace-thunk';
import type { Space } from '@/types/space';
import { getSpaceColumns } from './columns';
import SpaceForm from './SpaceForm';
import { useParams } from 'next/navigation';
import SpaceMembersModal from './SpaceMembersModal';

export default function Spaces() {
  const params = useParams();
  const workspaceId = params.workspaceId;
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const { organization } = useAppSelector((state) => state.auth);
  const { spaces, loading, total } = useAppSelector((state) => state.space);
  const { workspaces } = useAppSelector((state) => state.workspace);

  const [editingRecord, setEditingRecord] = useState<Space | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(workspaceId);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [membersModalOpen, setMembersModalOpen] = useState(false);

  const { isOpen, openModal, closeModal } = useModal();
  const { getColumnSearchProps } = useColumnSearch<Space>();

  // Load workspaces on component mount
  useEffect(() => {
    if (organization?.id) {
      dispatch(
        getAllWorkspaces({
          organizationId: organization.id,
          page: 1,
          limit: 100,
        }),
      );
    }
  }, [dispatch, organization?.id]);

  // Set default workspace when workspaces are loaded
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace) {
      setSelectedWorkspace(workspaces[0].id);
    }
  }, [workspaces, selectedWorkspace]);

  // Load spaces when workspace is selected
  useEffect(() => {
    if (selectedWorkspace) {
      dispatch(
        getAllSpaces({
          workspaceId: selectedWorkspace,
          page: pagination.current,
          limit: pagination.pageSize,
        }),
      );
    }
  }, [dispatch, selectedWorkspace, pagination]);

  const handleEdit = (record: Space) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSpace(id)).unwrap();
      toast.success('Space deleted successfully!');
      if (selectedWorkspace) {
        dispatch(
          getAllSpaces({
            workspaceId: selectedWorkspace,
            page: pagination.current,
            limit: pagination.pageSize,
          }),
        );
      }
    } catch (error) {
      toast.error('Failed to delete space.');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const space = spaces.find((s) => s.id === id);
      if (space?.isArchived) {
        await dispatch(unarchiveSpace(id)).unwrap();
        toast.success('Space unarchived successfully!');
      } else {
        await dispatch(archiveSpace(id)).unwrap();
        toast.success('Space archived successfully!');
      }

      if (selectedWorkspace) {
        dispatch(
          getAllSpaces({
            workspaceId: selectedWorkspace,
            page: pagination.current,
            limit: pagination.pageSize,
          }),
        );
      }
    } catch (error) {
      toast.error('Failed to archive/unarchive space.');
    }
  };

  const handleManageMembers = (space: Space) => {
    setSelectedSpace(space);
    setMembersModalOpen(true);
  };

  const columns = useMemo(
    () =>
      getSpaceColumns(
        getColumnSearchProps,
        handleEdit,
        handleDelete,
        handleArchive,
        handleManageMembers,
      ),
    [getColumnSearchProps],
  );

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingRecord) {
        await dispatch(
          updateSpace({ id: editingRecord.id, payload: values }),
        ).unwrap();
        toast.success('Space updated successfully!');
      } else {
        await dispatch(createSpace(values)).unwrap();
        toast.success('Space created successfully!');
      }

      if (selectedWorkspace) {
        dispatch(
          getAllSpaces({
            workspaceId: selectedWorkspace,
            page: pagination.current,
            limit: pagination.pageSize,
          }),
        );
      }
      closeModal();
      formRef.current?.resetForm();
      setEditingRecord(null);
    } catch (error) {
      toast.error(`Failed to ${editingRecord ? 'update' : 'create'} space.`);
    }
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setSelectedWorkspace(workspaceId);
    setPagination({ current: 1, pageSize: 10 });
  };

  const workspaceOptions = workspaces.map((workspace) => ({
    label: workspace.name,
    value: workspace.id,
  }));

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Space Management" />
      {/* 
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select
            placeholder="Select workspace"
            value={selectedWorkspace}
            onChange={handleWorkspaceChange}
            options={workspaceOptions}
            className="w-64"
            loading={!workspaces.length}
          />
        </div>
      </div> */}

      {selectedWorkspace && (
        <SearchableTable
          columns={columns}
          data={spaces}
          loading={loading}
          searchableField="name"
          createButtonText="Create Space"
          modalTitle={editingRecord ? 'Update Space' : 'Create Space'}
          modalContent={
            <SpaceForm
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
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize: pageSize || 10 });
            },
          }}
        />
      )}

      {!selectedWorkspace && workspaces.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            No workspaces found. Please create a workspace first.
          </p>
        </div>
      )}

      <SpaceMembersModal
        space={selectedSpace}
        open={membersModalOpen}
        onClose={() => {
          setMembersModalOpen(false);
          setSelectedSpace(null);
        }}
        onMemberAdded={() => {
          if (selectedWorkspace) {
            dispatch(
              getAllSpaces({
                workspaceId: selectedWorkspace,
                page: pagination.current,
                limit: pagination.pageSize,
              }),
            );
          }
        }}
      />
    </div>
  );
}
