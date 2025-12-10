'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  Table,
  Button,
  Select,
  Avatar,
  Tag,
  Popconfirm,
  Form,
  message,
} from 'antd';
import { UserAddOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';
import {
  addProjectMember,
  removeProjectMember,
} from '@/redux/feature/project/project-thunk';
import { ProjectRole } from '@/types/project';
import toast from 'react-hot-toast';
import { getOrganizationMembers } from '@/redux/feature/organization/organization-thunk';
import { Workspace } from '@/types/workspace';
import {
  addWorkspaceMember,
  removeWorkspaceMember,
} from '@/redux/feature/workspace/workspace-thunk';

type WorkspaceMembersModalProps = {
  workspace: Workspace | null;
  open: boolean;
  onClose: () => void;
  onMemberAdded?: () => void;
};

const WorkspaceMembersModal = ({
  workspace,
  open,
  onClose,
  onMemberAdded,
}: WorkspaceMembersModalProps) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { organization } = useAppSelector((state) => state.auth);

  const { members: orgMembers } = useAppSelector((state) => state.orgMembers);
  const { loading } = useAppSelector((state) => state.project);

  const [addingMember, setAddingMember] = useState(false);

  useEffect(() => {
    if (open && organization?.id) {
      dispatch(
        getOrganizationMembers(
          organization.id,
          // page: 1,
          // limit: 100,
        ),
      );
    }
  }, [open, organization?.id, dispatch]);

  const handleAddMember = async (values: {
    email: string;
    role: ProjectRole;
  }) => {
    if (!workspace) return;

    try {
      await dispatch(
        addWorkspaceMember({
          id: workspace.id,
          payload: {
            email: values.email,
            role: values.role,
          },
        }),
      ).unwrap();

      toast.success('Member added successfully!');
      form.resetFields();
      setAddingMember(false);
      onMemberAdded?.();
    } catch (error) {
      const message = 'Failed to add member';

      toast.error(message);
    }
  };

  const handleRemoveMember = async (record: any) => {
    if (!workspace) return;

    try {
      await dispatch(
        removeWorkspaceMember({
          workspaceId: workspace.id,
          memberId: record.id,
        }),
      ).unwrap();

      toast.success('Member removed successfully!');
      onMemberAdded?.();
    } catch (error) {
      toast.error('Failed to remove member');
    }
  };

  const columns = [
    {
      title: 'Member',
      //   dataIndex: 'user',
      key: 'member',
      render: (member: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-gray-500">
            {member.firstName?.charAt(0)}
            {member.lastName?.charAt(0)}
          </Avatar>
          <div>
            <div className="font-medium text-gray-800 dark:text-white">
              {member.firstName} {member.lastName}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {member.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: ProjectRole) => (
        <Tag
          color={
            role === 'admin' ? 'red' : role === 'member' ? 'blue' : 'green'
          }
          className="capitalize"
        >
          {role}
        </Tag>
      ),
    },
    {
      title: 'Added Date',
      dataIndex: 'addedAt',
      key: 'addedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Popconfirm
          title="Remove Member"
          description="Are you sure you want to remove this member from the workspace?"
          onConfirm={() => handleRemoveMember(record)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            className="text-red-600 hover:text-red-700"
          />
        </Popconfirm>
      ),
    },
  ];

  // Filter out members who are already in the project
  const availableMembers = orgMembers.filter(
    (orgMember) =>
      !workspace?.members?.some(
        (projectMember) => projectMember.userId === orgMember.user?.id,
      ),
  );

  const memberOptions = availableMembers.map((member) => ({
    label: member?.user?.email,
    value: member?.user?.email,
  }));

  const roleOptions = [
    { label: 'Admin', value: ProjectRole.ADMIN },
    { label: 'Member', value: ProjectRole.MEMBER },
    { label: 'Viewer', value: ProjectRole.VIEWER },
  ];

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
              {workspace?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {workspace?.name} - Members
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Manage workspace team members
              </p>
            </div>
          </div>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => setAddingMember(true)}
            disabled={availableMembers.length === 0}
          >
            Add Member
          </Button>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="workspace-members-modal"
    >
      <div className="space-y-4">
        {/* Add Member Form */}
        {addingMember && (
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
              Add New Member
            </h4>
            <Form
              form={form}
              layout="inline"
              onFinish={handleAddMember}
              className="w-full"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please select a member' }]}
                className="flex-1"
              >
                <Select
                  placeholder="Select a member"
                  options={memberOptions}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  style={{ width: 300 }}
                />
              </Form.Item>
              <Form.Item
                name="role"
                rules={[{ required: true, message: 'Please select a role' }]}
                initialValue={ProjectRole.MEMBER}
              >
                <Select
                  placeholder="Select role"
                  options={roleOptions}
                  className="w-32"
                />
              </Form.Item>
              <Form.Item>
                <div className="flex gap-2">
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Add
                  </Button>
                  <Button
                    onClick={() => {
                      setAddingMember(false);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        )}

        {/* Members Table */}
        <Table
          columns={columns}
          dataSource={workspace?.members || []}
          rowKey="id"
          pagination={false}
          size="small"
          locale={{
            emptyText: 'No members found',
          }}
        />

        {availableMembers.length === 0 && !addingMember && (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            All organization members are already part of this workspace
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WorkspaceMembersModal;
