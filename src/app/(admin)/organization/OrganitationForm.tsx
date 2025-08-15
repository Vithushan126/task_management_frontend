'use client';

import { Button, Form } from 'antd';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAppSelector } from '@/hooks/use-redux';
import dayjs from 'dayjs';
import BaseForm from '@/components/antd-form/BaseForm';
import BaseInput from '@/components/antd-form/BaseInput';
import BaseTextArea from '@/components/antd-form/BaseTextArea';
import BaseDatePicker from '@/components/antd-form/BaseDatePicker';
import BaseUpload from '@/components/antd-form/BaseUpload';

type OrganizationFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
};

// Expose resetForm() to parent
const OrganitationForm = forwardRef(
  (
    { onSubmit, initialValues, onFinishModalClose }: OrganizationFormProps,
    ref,
  ) => {
    console.log('initialValues', initialValues);

    const [form] = Form.useForm();
    const { loading } = useAppSelector((state) => state.organization);

    // Expose resetForm method to parent
    useImperativeHandle(ref, () => ({
      resetForm: () => form.resetFields(),
    }));

    useEffect(() => {
      if (initialValues) {
        const clonedValues = {
          ...initialValues,
          organizationName: initialValues.name,
          firstName: initialValues?.users[0]?.firstName || '',
          lastName: initialValues?.users[0]?.lastName || '',
          email: initialValues?.users[0]?.email || '',
        };

        if (clonedValues.registrationDate) {
          clonedValues.registrationDate = dayjs(clonedValues.registrationDate);
        }

        if (
          clonedValues.imageUrl &&
          typeof clonedValues.imageUrl === 'string'
        ) {
          clonedValues.orgImage = [
            {
              uid: '-1',
              name: 'Logo',
              status: 'done',
              url: clonedValues.imageUrl,
            },
          ];
        }

        form.setFieldsValue(clonedValues);
      } else {
        form.resetFields();
      }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
      console.log('values', values);

      const formData = new FormData();

      formData.append('organizationName', values.organizationName || '');
      formData.append('firstName', values.firstName || '');
      formData.append('lastName', values.lastName || '');
      formData.append('email', values.email || '');
      formData.append('contactNumber', values.contactNumber || '');
      formData.append('address', values.address || '');
      formData.append(
        'registrationDate',
        values.registrationDate?.toISOString() || '',
      );
      formData.append('roleId', '2'); // Ensure roleId is string

      const fileObj = values.orgImage?.[0]?.originFileObj;
      if (fileObj) {
        formData.append('orgImage', fileObj);
      }

      onSubmit(formData);
    };

    const handleClose = () => {
      form.resetFields();
      onFinishModalClose?.();
    };

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-1 "
      >
        <BaseInput
          name="organizationName"
          label="Organization Name"
          placeholder="Enter name"
          required
        />
        <BaseInput
          name="firstName"
          label="Admin First Name"
          placeholder="Enter first name"
          required
        />
        <BaseInput
          name="lastName"
          label="Admin Last Name"
          placeholder="Enter last name"
          required
        />
        <BaseInput
          name="email"
          label="Email"
          placeholder="Enter email"
          type="email"
          required
        />
        <BaseInput
          name="contactNumber"
          label="Contact Number"
          placeholder="Enter number"
          required
          type="number"
        />
        <BaseTextArea
          name="address"
          label="Address"
          placeholder="Enter address"
          required
          rows={2}
        />
        <BaseDatePicker
          name="registrationDate"
          label="Registration Date"
          placeholder="Select date"
          disabledDate={(current) =>
            current && current < dayjs().startOf('day')
          }
          required
          disabled={!!initialValues}
        />
        <BaseUpload name="orgImage" label="Upload Photo" required />

        <Form.Item className="col-span-full">
          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose}>Close</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
          </div>
        </Form.Item>
      </BaseForm>
    );
  },
);

OrganitationForm.displayName = 'OrganitationForm';
export default OrganitationForm;
