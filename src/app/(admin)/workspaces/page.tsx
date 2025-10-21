'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SearchableTable } from '@/components/common/table';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import { useModal } from '@/hooks/useModal';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  getAllWorkspaces,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
} from '@/redux/feature/workspace/workspace-thunk';
import type { Workspace } from '@/types/workspace';
import { getWorkspaceColumns } from './columns';
import WorkspaceForm from './WorkspaceForm';

export default function Workspaces() {
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const { user, organization } = useAppSelector((state) => state.auth);
  const { workspaces, loading, total } = useAppSelector(
    (state) => state.workspace,
  );

  const [editingRecord, setEditingRecord] = useState<Workspace | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState<{
    field?: string;
    order?: 'ascend' | 'descend';
  }>({});
  const { isOpen, openModal, closeModal } = useModal();
  const { getColumnSearchProps } = useColumnSearch<Workspace>();

  const handleEdit = (record: Workspace) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteWorkspace(id)).unwrap();
      toast.success('Workspace deleted successfully!');
      dispatch(
        getAllWorkspaces({
          organizationId: organization?.id,
          page: pagination.current,
          limit: pagination.pageSize,
        }),
      );
    } catch (error) {
      toast.error('Failed to delete workspace.');
    }
  };

  const columns = useMemo(
    () => getWorkspaceColumns(getColumnSearchProps, handleEdit, handleDelete),
    [getColumnSearchProps],
  );

  const handleCreateOrUpdate = async (values: any) => {
    try {
      if (editingRecord) {
        await dispatch(
          updateWorkspace({ id: editingRecord.id, payload: values }),
        ).unwrap();
        toast.success('Workspace updated successfully!');
      } else {
        await dispatch(
          createWorkspace({
            ...values,
            organizationId: organization?.id,
          }),
        ).unwrap();
        toast.success('Workspace created successfully!');
      }

      dispatch(
        getAllWorkspaces({
          organizationId: organization?.id,
          page: pagination.current,
          limit: pagination.pageSize,
        }),
      );
      closeModal();
      formRef.current?.resetForm();
      setEditingRecord(null);
    } catch (error) {
      toast.error(
        `Failed to ${editingRecord ? 'update' : 'create'} workspace.`,
      );
    }
  };

  useEffect(() => {
    if (organization?.id) {
      dispatch(
        getAllWorkspaces({
          organizationId: organization.id,
          page: pagination.current,
          limit: pagination.pageSize,
          sortField: sorter.field ?? 'createdAt',
          direction: sorter.order === 'ascend' ? 'ASC' : 'DESC',
        }),
      );
    }
  }, [dispatch, organization?.id, pagination, sorter]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    setSorter({ field: sorter.field, order: sorter.order });
  };

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Workspace Management" />

      <SearchableTable
        columns={columns}
        data={workspaces}
        loading={loading}
        searchableField="name"
        createButtonText="Create Workspace"
        modalTitle={editingRecord ? 'Update Workspace' : 'Create Workspace'}
        modalContent={
          <WorkspaceForm
            ref={formRef}
            onSubmit={handleCreateOrUpdate}
            initialValues={editingRecord || undefined}
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
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}
