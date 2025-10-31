'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useModal } from '@/hooks/useModal';
import { getOrganizationColumns } from './column';
import OrganitationForm from './OrganitationForm';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import toast from 'react-hot-toast';
import SearchableTable from '@/components/common/table/SearchableTable';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import {
  createOrganization,
  getAllOrganization,
} from '@/redux/feature/organization/organization-thunk';
import type { Organization } from '@/types';
import { deleteUser, register } from '@/redux/feature/auth/auth-thunk';

export default function Organization() {
  const dispatch = useAppDispatch();
  const { organization, loading, total, page, limit } = useAppSelector(
    (state) => state.organization,
  );

  const { isOpen, openModal, closeModal } = useModal();
  const [editingRecord, setEditingRecord] = useState<Organization | null>(null);

  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [sorter, setSorter] = useState<{
    field?: string;
    order?: 'ascend' | 'descend';
  }>({});

  const { getColumnSearchProps } = useColumnSearch<Organization>();

  const formRef = useRef<any>(null); // to access resetForm()

  const handleEdit = (record: Organization) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: number) => {
    console.log('delete');

    // try {
    //   await dispatch(deleteOrganizationById(id)).unwrap();
    //   toast.success('Organization deleted successfully');
    //   dispatch(getAllOrganization());
    // } catch (error) {
    //   toast.error('Failed to delete Organization');
    // }
  };

  const columns = useMemo(
    () =>
      getOrganizationColumns(getColumnSearchProps, handleEdit, handleDelete),
    [getColumnSearchProps],
  );

  const handleCreateOrUpdate = async (values: any) => {
    if (editingRecord) {
      // if (typeof editingRecord.id === 'number') {
      //   const resultAction = await dispatch(
      //     updateOrganization({ id: editingRecord.id, payload: formData }),
      //   );
      //   if (updateOrganization.fulfilled.match(resultAction)) {
      //     toast.success('Organization updated successfully!');
      //     dispatch(getAllOrganization());
      //     closeModal();
      //     setEditingRecord(null);
      //     formRef.current?.resetForm(); // ✅ Reset the form
      //   } else {
      //     toast.error('Failed to update Organization.');
      //   }
      // }
    } else {
      console.log('formData', values);
      let authRes: any = null;

      try {
        const authPayload = {
          email: values.email,
          password: 'admin@123',
          role: 'admin' as const,
          firstName: values.firstName,
          lastName: values.lastName,
          organizationName: values.organizationName,
        };
        const authRes = await dispatch(register(authPayload)).unwrap();

        await dispatch(
          getAllOrganization({
            page: pagination.current,
            limit: pagination.pageSize,
            sortBy: sorter.field ?? 'createdAt',
            sortOrder: sorter.order === 'ascend' ? 'ASC' : 'DESC',
          }),
        );

        toast.success('Organization created successfully!');
        closeModal();
        formRef.current?.resetForm();
      } catch (err) {
        console.error('Error:', err);
        if (authRes?.user?.id) {
          try {
            await dispatch(deleteUser(authRes.user.id)).unwrap();
            console.log(`Rolled back user ${authRes.user.id}`);
          } catch (rollbackErr) {
            console.error('Rollback failed:', rollbackErr);
          }
        }

        toast.error('Failed to create organization, please try again.');
      }
    }
  };

  useEffect(() => {
    dispatch(
      getAllOrganization({
        page: pagination.current,
        limit: pagination.pageSize,
        sortBy: sorter.field ?? 'createdAt',
        sortOrder: sorter.order === 'ascend' ? 'ASC' : 'DESC',
      }),
    );
  }, [dispatch, pagination, sorter]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setPagination({
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
    setSorter({ field: sorter.field, order: sorter.order });
  };

  return (
    <div className="space-y-4 w-full">
      <PageBreadcrumb pageTitle="Organization Management" />
      <SearchableTable
        rowKey="id"
        columns={columns}
        data={organization || []}
        loading={loading}
        searchableField="name"
        width={800}
        createButtonText="Create Organization"
        modalTitle={
          editingRecord ? 'Update the Organization' : 'Create the Organization'
        }
        modalContent={
          <OrganitationForm
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
