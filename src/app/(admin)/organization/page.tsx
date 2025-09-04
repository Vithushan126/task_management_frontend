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
import {
  createOrganization,
  getAllOrganization,
} from '@/redux/feature/organization/organization-thunk';
import { Organization } from '@/types';
import { deleteUser, register } from '@/redux/feature/auth/auth-thunk';

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
        // Step 1: Create auth user
        const authPayload = {
          email: values.email,
          password: '123456',
          role: 'admin',
          firstName: 'vithu',
          lastName: 'jathu',
        };
        const authRes = await dispatch(register(authPayload)).unwrap();
        console.log('authRes', authRes);

        const formData = new FormData();
        formData.append('name', values.name || '');
        formData.append('description', values.description || '');
        formData.append('ownerId', authRes.user?.id); // ✅ attach auth userId

        // Handle file upload (orgImage)
        const fileObj = values.logo?.[0]?.originFileObj;
        if (fileObj) {
          formData.append('logo', fileObj);
        }

        // Step 3: Dispatch with formData
        await dispatch(createOrganization(formData)).unwrap();

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
