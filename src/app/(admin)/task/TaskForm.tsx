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

type TaskFormFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
  workspaceId?: string;
};

const TaskForm = forwardRef(
  (
    {
      onSubmit,
      initialValues,
      onFinishModalClose,
      workspaceId,
    }: TaskFormFormProps,
    ref,
  ) => {
    const [form] = Form.useForm();
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.project);
    const { spaces } = useAppSelector((state) => state.space);
    const [selectedProject, setSelectedProject] = useState<string>('');

    // Expose resetForm method to parent
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        form.resetFields();
        setSelectedProject('');
      },
    }));

    useEffect(() => {
      if (workspaceId) {
        dispatch(getAllSpaces({ workspaceId, page: 1, limit: 100 }));
      }
    }, [dispatch, workspaceId]);

    useEffect(() => {
      if (initialValues) {
        const clonedValues = {
          ...initialValues,
          startDate: initialValues.startDate
            ? dayjs(initialValues.startDate)
            : null,
          endDate: initialValues.endDate ? dayjs(initialValues.endDate) : null,
        };
        form.setFieldsValue(clonedValues);
        setSelectedProject(initialValues.spaceId || '');
      } else {
        form.resetFields();
        setSelectedProject('');
      }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
      const payload = {
        title: values.title,
        description: values.description,
        // status: values.status,
        priority: values.priority,
        dueDate: values.dueDate ? values.dueDate.toISOString() : null,
        projectId: selectedProject,
      };
      onSubmit(payload);
    };

    const handleClose = () => {
      form.resetFields();
      setSelectedProject('');
      onFinishModalClose?.();
    };

    const statusOptions = [
      { label: 'NEW', value: 'NEW' },
      { label: 'PENDING', value: 'PENDING' },
      { label: 'INPROGRESS', value: 'INPROGRESS' },
      { label: 'COMPLETED', value: 'COMPLETED' },
    ];

    const priorityOptions = [
      { label: 'LOW', value: 'LOW' },
      { label: 'MEDIUM', value: 'MEDIUM' },
      { label: 'HIGH', value: 'HIGH' },
      { label: 'URGENT', value: 'URGENT' },
    ];

    const spaceOptions = spaces.map((project) => ({
      label: project.name,
      value: project.id,
    }));

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 "
      >
        <BaseInput
          name="title"
          label="Task Name"
          placeholder="Enter task name"
          required
        />

        <BaseTextArea
          name="description"
          label="Description"
          placeholder="Enter Task description"
          rows={3}
        />

        <BaseSelect
          name="projectId"
          label="Project"
          placeholder="Select a Project"
          options={spaceOptions}
          //   value={selectedSpace}
          onChange={setSelectedProject}
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
          <Form.Item name="dueDate" label="Due Date" className="mb-0">
            <DatePicker className="w-full" placeholder="Select Due date" />
          </Form.Item>

          {/* <Form.Item name="endDate" label="End Date" className="mb-0">
            <DatePicker className="w-full" placeholder="Select end date" />
          </Form.Item> */}
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

TaskForm.displayName = 'TaskForm';
export default TaskForm;
