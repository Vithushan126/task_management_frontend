'use client';

import { Button, Form } from 'antd';
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useAppSelector } from '@/hooks/use-redux';
import BaseForm from '@/components/antd-form/BaseForm';
import BaseInput from '@/components/antd-form/BaseInput';
import BaseTextArea from '@/components/antd-form/BaseTextArea';
import BaseSelect from '@/components/antd-form/BaseSelect';

type WorkspaceFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
};

const WorkspaceForm = forwardRef(
  (
    { onSubmit, initialValues, onFinishModalClose }: WorkspaceFormProps,
    ref,
  ) => {
    const [form] = Form.useForm();
    const { loading } = useAppSelector((state) => state.workspace);

    // Expose resetForm method to parent
    useImperativeHandle(ref, () => ({
      resetForm: () => form.resetFields(),
    }));

    useEffect(() => {
      if (initialValues) {
        const clonedValues = {
          ...initialValues,
          workspaceName: initialValues.name,
        };
        form.setFieldsValue(clonedValues);
      } else {
        form.resetFields();
      }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
      const payload = {
        name: values.workspaceName,
        description: values.description,
        visibility: values.visibility,
      };
      onSubmit(payload);
    };

    const handleClose = () => {
      form.resetFields();
      onFinishModalClose?.();
    };

    const visibilityOptions = [
      { label: 'Private', value: 'private' },
      { label: 'Internal', value: 'internal' },
      { label: 'Public', value: 'public' },
    ];

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 gap-4"
      >
        <BaseInput
          name="workspaceName"
          label="Workspace Name"
          placeholder="Enter workspace name"
          required
        />

        <BaseTextArea
          name="description"
          label="Description"
          placeholder="Enter workspace description"
          rows={3}
        />

        <BaseSelect
          name="visibility"
          label="Visibility"
          placeholder="Select visibility"
          options={visibilityOptions}
          required
        />

        <Form.Item className="mb-0">
          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose}>Close</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {initialValues ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </BaseForm>
    );
  },
);

WorkspaceForm.displayName = 'WorkspaceForm';
export default WorkspaceForm;