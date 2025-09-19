'use client';

import { Button, Form, ColorPicker } from 'antd';
import { useEffect, forwardRef, useImperativeHandle, useState } from 'react';
import { useAppSelector } from '@/hooks/use-redux';
import BaseForm from '@/components/antd-form/BaseForm';
import BaseInput from '@/components/antd-form/BaseInput';
import BaseTextArea from '@/components/antd-form/BaseTextArea';
import BaseSelect from '@/components/antd-form/BaseSelect';

type SpaceFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
  workspaceId: string;
};

const SpaceForm = forwardRef(
  (
    { onSubmit, initialValues, onFinishModalClose, workspaceId }: SpaceFormProps,
    ref,
  ) => {
    const [form] = Form.useForm();
    const { loading } = useAppSelector((state) => state.space);
    const [selectedColor, setSelectedColor] = useState('#4CAF50');
    const [selectedIcon, setSelectedIcon] = useState('💻');

    // Expose resetForm method to parent
    useImperativeHandle(ref, () => ({
      resetForm: () => {
        form.resetFields();
        setSelectedColor('#4CAF50');
        setSelectedIcon('💻');
      },
    }));

    useEffect(() => {
      if (initialValues) {
        const clonedValues = {
          ...initialValues,
          spaceName: initialValues.name,
        };
        form.setFieldsValue(clonedValues);
        setSelectedColor(initialValues.color || '#4CAF50');
        setSelectedIcon(initialValues.icon || '💻');
      } else {
        form.resetFields();
        setSelectedColor('#4CAF50');
        setSelectedIcon('💻');
      }
    }, [initialValues, form]);

    const handleFinish = (values: any) => {
      const payload = {
        name: values.spaceName,
        description: values.description,
        color: selectedColor,
        icon: selectedIcon,
        visibility: values.visibility,
        workspaceId: workspaceId,
        settings: {
          views: {
            defaultView: 'list',
            enabledViews: ['list', 'board', 'gantt', 'calendar']
          },
          features: {
            goals: true,
            milestones: true,
            automations: false,
            customFields: true,
            dependencies: true,
            timeTracking: true
          },
          permissions: {
            whoCanEditSpace: 'admins',
            whoCanDeleteTasks: 'task_creators',
            whoCanCreateFolders: 'admins',
            whoCanInviteMembers: 'members'
          },
          customFields: [
            {
              id: 'priority',
              name: 'Priority',
              type: 'dropdown',
              options: ['Low', 'Medium', 'High'],
              required: false,
              defaultValue: 'Medium'
            }
          ],
          notifications: {
            webhookUrl: null,
            emailDigest: true,
            slackIntegration: false
          }
        }
      };
      onSubmit(payload);
    };

    const handleClose = () => {
      form.resetFields();
      setSelectedColor('#4CAF50');
      setSelectedIcon('💻');
      onFinishModalClose?.();
    };

    const visibilityOptions = [
      { label: 'Private', value: 'private' },
      { label: 'Internal', value: 'internal' },
      { label: 'Public', value: 'public' },
    ];

    const iconOptions = [
      { label: '💻 Computer', value: '💻' },
      { label: '🚀 Rocket', value: '🚀' },
      { label: '📊 Chart', value: '📊' },
      { label: '🎯 Target', value: '🎯' },
      { label: '⚡ Lightning', value: '⚡' },
      { label: '🔧 Tools', value: '🔧' },
      { label: '📱 Mobile', value: '📱' },
      { label: '🌟 Star', value: '🌟' },
      { label: '🏢 Building', value: '🏢' },
      { label: '💡 Bulb', value: '💡' },
      { label: '🎨 Art', value: '🎨' },
      { label: '📝 Note', value: '📝' },
    ];

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 gap-4"
      >
        <BaseInput
          name="spaceName"
          label="Space Name"
          placeholder="Enter space name"
          required
        />

        <BaseTextArea
          name="description"
          label="Description"
          placeholder="Enter space description"
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color
            </label>
            <ColorPicker
              value={selectedColor}
              onChange={(color) => setSelectedColor(color.toHexString())}
              showText
              size="large"
              className="w-full"
            />
          </div>

          <BaseSelect
            name="icon"
            label="Icon"
            placeholder="Select an icon"
            options={iconOptions}
            value={selectedIcon}
            onChange={setSelectedIcon}
            required
          />
        </div>

        <BaseSelect
          name="visibility"
          label="Visibility"
          placeholder="Select visibility"
          options={visibilityOptions}
          required
        />

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview
          </h4>
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
              style={{ backgroundColor: selectedColor }}
            >
              {selectedIcon}
            </div>
            <div>
              <div className="font-medium text-gray-800 dark:text-white/90 text-sm">
                {form.getFieldValue('spaceName') || 'Space Name'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {form.getFieldValue('description') || 'Space description'}
              </div>
            </div>
          </div>
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

SpaceForm.displayName = 'SpaceForm';
export default SpaceForm;