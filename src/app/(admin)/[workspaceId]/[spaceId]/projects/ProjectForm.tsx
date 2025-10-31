'use client';

import { Button, Form, DatePicker } from 'antd';
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/use-redux';
import { getAllSpaces } from '@/redux/feature/space/space-thunk';
import BaseForm from '@/components/antd-form/BaseForm';
import BaseInput from '@/components/antd-form/BaseInput';
import BaseTextArea from '@/components/antd-form/BaseTextArea';
import BaseSelect from '@/components/antd-form/BaseSelect';
import { ProjectStatus } from '@/types/project';
import dayjs from 'dayjs';

type ProjectFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
  spaceId?: string;
};

const ProjectForm = forwardRef(
  (
    { onSubmit, initialValues, onFinishModalClose, spaceId }: ProjectFormProps,
    ref,
  ) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.project);
    const { spaces } = useAppSelector((state) => state.space);
    const [selectedSpace, setSelectedSpace] = useState<string>('');

    // Expose resetForm method to parent
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        form.resetFields();
        setSelectedSpace('');
      },
    }));

    useEffect(() => {
      if (spaceId) {
        dispatch(getAllSpaces({ spaceId, page: 1, limit: 100 }));
      }
    }, [dispatch, spaceId]);

    useEffect(() => {
      if (initialValues) {
        const clonedValues = {
          ...initialValues,
          startDate: initialValues.startDate ? dayjs(initialValues.startDate) : null,
          endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
        };
        form.setFieldsValue(clonedValues);
        setSelectedSpace(initialValues.spaceId || '');
      } else {
        form.resetFields();
        setSelectedSpace('');
      }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
      const payload = {
        name: values.name,
        description: values.description,
        status: values.status,
        priority: values.priority,
        startDate: values.startDate ? values.startDate.toISOString() : null,
        endDate: values.endDate ? values.endDate.toISOString() : null,
        spaceId: selectedSpace,
      };
      onSubmit(payload);
    };

    const handleClose = () => {
      form.resetFields();
      setSelectedSpace('');
      onFinishModalClose?.();
    };

    const statusOptions = [
      { label: 'Planning', value: ProjectStatus.PLANNING },
      { label: 'Active', value: ProjectStatus.ACTIVE },
      { label: 'On Hold', value: ProjectStatus.ON_HOLD },
      { label: 'Completed', value: ProjectStatus.COMPLETED },
      { label: 'Cancelled', value: ProjectStatus.CANCELLED },
    ];

    const priorityOptions = [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
      { label: 'Urgent', value: 'urgent' },
    ];

    const spaceOptions = spaces.map(space => ({
      label: space.name,
      value: space.id,
    }));

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 gap-4"
      >
        <BaseInput
          name="name"
          label="Project Name"
          placeholder="Enter project name"
          required
        />

        <BaseTextArea
          name="description"
          label="Description"
          placeholder="Enter project description"
          rows={3}
        />

        <BaseSelect
          name="spaceId"
          label="Space"
          placeholder="Select a space"
          options={spaceOptions}
          // value={selectedSpace}
          onChange={setSelectedSpace}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <BaseSelect
            name="status"
            label="Status"
            placeholder="Select status"
            options={statusOptions}
            required
          />

          <BaseSelect
            name="priority"
            label="Priority"
            placeholder="Select priority"
            options={priorityOptions}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="startDate"
            label="Start Date"
            className="mb-0"
          >
            <DatePicker 
              className="w-full" 
              placeholder="Select start date"
            />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="End Date"
            className="mb-0"
          >
            <DatePicker 
              className="w-full" 
              placeholder="Select end date"
            />
          </Form.Item>
        </div>

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

ProjectForm.displayName = 'ProjectForm';
export default ProjectForm;