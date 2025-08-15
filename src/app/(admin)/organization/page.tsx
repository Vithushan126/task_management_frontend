'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import { useModal } from '@/hooks/useModal';
import { getOrganizationColumns } from './column';
import OrganitationForm from './OrganitationForm';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import toast from 'react-hot-toast';
// import {
//   createOrganization,
//   deleteOrganizationById,
//   getAllOrganization,
//   updateOrganization,
// } from '@/redux/features/organization/organization-thunk';
import SearchableTable from '@/components/common/table/SearchableTable';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import { getAllOrganization } from '@/redux/feature/organization/organization-thunk';
import { Organization } from '@/types';

export default function Organization() {
  const dispatch = useAppDispatch();
  const { organization, loading } = useAppSelector(
    (state) => state.organization,
  );
  const { isOpen, openModal, closeModal } = useModal();
  const [editingRecord, setEditingRecord] = useState<Organization | null>(null);

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

  const handleCreateOrUpdate = async (formData: any) => {
    // if (editingRecord) {
    //   if (typeof editingRecord.id === 'number') {
    //     const resultAction = await dispatch(
    //       updateOrganization({ id: editingRecord.id, payload: formData }),
    //     );
    //     if (updateOrganization.fulfilled.match(resultAction)) {
    //       toast.success('Organization updated successfully!');
    //       dispatch(getAllOrganization());
    //       closeModal();
    //       setEditingRecord(null);
    //       formRef.current?.resetForm(); // ✅ Reset the form
    //     } else {
    //       toast.error('Failed to update Organization.');
    //     }
    //   }
    // } else {
    //   const resultAction = await dispatch(createOrganization(formData));
    //   console.log('qqqqqqqqqqqdssssssssssssssssssss');
    //   if (createOrganization.fulfilled.match(resultAction)) {
    //     console.log('dsssssssss');
    //     toast.success('Organization created successfully!');
    //     dispatch(getAllOrganization());
    //     closeModal();
    //     formRef.current?.resetForm(); // ✅ Reset the form
    //   } else {
    //     toast.error('Failed to create Organization.');
    //   }
    // }
  };

  useEffect(() => {
    dispatch(getAllOrganization());
  }, [dispatch]);

  return (
    <div className="space-y-4 w-full">
      <PageBreadcrumb pageTitle="Organization Management" />
      <SearchableTable
        columns={columns}
        data={organization}
        loading={loading}
        searchableField="name"
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
        // width={900}
      />
    </div>
  );
}
