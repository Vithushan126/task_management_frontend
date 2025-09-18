'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { SearchableTable } from '@/components/common/table';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import { useModal } from '@/hooks/useModal';
import type { Members } from '@/types';
import { getEmployeeColumns } from './coloum';
import MembersForm from './MembersForm';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  createOrganizationMultipleMember,
  getOrganizationMembers,
  getOrganizationInvitations,
} from '@/redux/feature/organization/organization-thunk';

export default function Members() {
  const dispatch = useAppDispatch();
  const formRef = useRef<any>(null);
  const { organization } = useAppSelector((state) => state.auth);
  const orgId = organization?.id;
  const { members, loading } = useAppSelector((state) => state.orgMembers);
  const [selectedFilter, setSelectedFilter] = useState<string>('active');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { isOpen, openModal, closeModal } = useModal();
  const [editingRecord, setEditingRecord] = useState<Members | null>(null);

  const { getColumnSearchProps } = useColumnSearch<Members>();

  const handleEdit = (record: Members) => {
    setEditingRecord(record);
    openModal();
  };

  const handleDelete = async (id: any) => {
    try {
      //   const resultAction = await dispatch(
      //     terminateEmployeeThunk({ id, orgId }),
      //   );
      //   if (terminateEmployeeThunk.fulfilled.match(resultAction)) {
      //     toast.success('Employee terminated successfully!');
      //     dispatch(getOrganizationMembers(orgId));
      //   } else {
      //     toast.error('Failed to terminate Employee.');
      //     console.error('Delete failed:', resultAction);
      //   }
    } catch (error) {
      console.error('Error terminated Employee :', error);
      toast.error('An unexpected error occurred.');
    }
  };

  const columns = useMemo(
    () => getEmployeeColumns(getColumnSearchProps, handleEdit, handleDelete, selectedFilter),
    [getColumnSearchProps, selectedFilter],
  );

  const handleCreateOrUpdate = async (formData: FormData) => {
    if (editingRecord) {
      //   console.log('Update department:', formData);
      //   const updatedVisitor = { ...editingRecord, ...formData };
      //   if (typeof editingRecord.id === 'number') {
      //     const resultAction = await dispatch(
      //       updateEmployeeThunk({ id: editingRecord.id, payload: formData }),
      //     );
      //     // Check if update was successful
      //     if (updateEmployeeThunk.fulfilled.match(resultAction)) {
      //       toast.success('Employee updated successfully!');
      //       dispatch(getAllEmployeeThunk({ orgId }));
      //       closeModal();
      //       setEditingRecord(null);
      //     } else {
      //       toast.error('Failed to update Employee.');
      //       console.error('Update failed:', resultAction);
      //     }
      //   } else {
      //     console.error('Invalid editingRecord.id:', editingRecord.id);
      //   }
    } else {
      console.log('Create new department:', formData);
      try {
        await dispatch(
          createOrganizationMultipleMember({ orgId, payload: formData }),
        ).unwrap();
        toast.success('Employee created successfully!');
        dispatch(getOrganizationMembers(orgId));
        closeModal();
        formRef.current?.resetForm();
        setEditingRecord(null);
      } catch (error) {
        console.log('error', error);

        toast.error('Failed to create Employee.');
      }
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedFilter(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    
    // Call different thunk based on selected filter
    if (value === 'pending') {
      dispatch(getOrganizationInvitations(orgId));
    } else {
      dispatch(getOrganizationMembers(orgId));
    }
  };

  useEffect(() => {
    dispatch(getOrganizationMembers(orgId));
  }, [dispatch, orgId]);

  return (
    <div className="space-y-4">
      <PageBreadcrumb pageTitle="Employee Management" />

      <SearchableTable
        columns={columns}
        data={members}
        loading={loading}
        radioOptions={[
          { label: 'Active Members', value: 'active' },
          { label: 'Invited Members', value: 'pending' },
          { label: 'Suspended Members', value: 'suspended' },
        ]}
        onRadioChange={handleRadioChange}
        // searchableField="firstName"
        createButtonText="Invite Member"
        modalTitle={editingRecord ? 'Update the Member' : 'Invite the Member'}
        modalContent={
          <MembersForm
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
        width={900}
      />
    </div>
  );
}
