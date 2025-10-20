'use client';

import { Modal, Descriptions, Tag, Progress, Avatar, Divider } from 'antd';
import {
  CalendarOutlined,
  UserOutlined,
  FlagOutlined,
} from '@ant-design/icons';
import type { Project } from '@/types/project';
import { ProjectStatus } from '@/types/project';

type ProjectDetailsModalProps = {
  project: Project | null;
  open: boolean;
  onClose: () => void;
};

const ProjectDetailsModal = ({
  project,
  open,
  onClose,
}: ProjectDetailsModalProps) => {
  if (!project) return null;

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNING:
        return 'blue';
      case ProjectStatus.ACTIVE:
        return 'green';
      case ProjectStatus.ON_HOLD:
        return 'orange';
      case ProjectStatus.COMPLETED:
        return 'purple';
      case ProjectStatus.CANCELLED:
        return 'red';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'green';
      case 'medium':
        return 'blue';
      case 'high':
        return 'orange';
      case 'urgent':
        return 'red';
      default:
        return 'default';
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {project.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Project Details
            </p>
          </div>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      className="project-details-modal"
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
            Basic Information
          </h4>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="Project Name">
              {project.name}
            </Descriptions.Item>
            <Descriptions.Item label="Workspace">
              {project.workspace?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={getStatusColor(project.status)}
                className="capitalize"
              >
                {project.status.replace('_', ' ')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Priority">
              <Tag
                color={getPriorityColor(project.priority)}
                className="capitalize"
              >
                {project.priority}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Owner">
              <div className="flex items-center gap-2">
                <Avatar size="small" className="bg-gray-500">
                  {project.owner?.firstName?.charAt(0)}
                  {project.owner?.lastName?.charAt(0)}
                </Avatar>
                {`${project.owner?.firstName} ${project.owner?.lastName}`}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="Progress">
              <Progress
                percent={project.progress?.percentage || 0}
                size="small"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* Description */}
        {project.description && (
          <div>
            <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
              Description
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {project.description}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
            Timeline
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarOutlined className="text-blue-500" />
              <span className="text-gray-600 dark:text-gray-300">
                Start Date:
              </span>
              <span className="font-medium">
                {project.startDate
                  ? new Date(project.startDate).toLocaleDateString()
                  : 'Not set'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <CalendarOutlined className="text-red-500" />
              <span className="text-gray-600 dark:text-gray-300">
                End Date:
              </span>
              <span className="font-medium">
                {project.endDate
                  ? new Date(project.endDate).toLocaleDateString()
                  : 'Not set'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
            Statistics
          </h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {project.memberCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Members
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {project.taskCount || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Total Tasks
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {project.completedTasks || 0}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Completed
              </div>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">
            Team Members ({project.members?.length || 0})
          </h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {project.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="bg-gray-500">
                    {member.user.firstName.charAt(0)}
                    {member.user.lastName.charAt(0)}
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-white">
                      {`${member.user.firstName} ${member.user.lastName}`}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {member.user.email}
                    </div>
                  </div>
                </div>
                <Tag
                  color={member.role === 'admin' ? 'red' : 'blue'}
                  className="capitalize"
                >
                  {member.role}
                </Tag>
              </div>
            ))}
            {(!project.members || project.members.length === 0) && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No members found
              </div>
            )}
          </div>
        </div>

        {/* Timestamps */}
        <Divider />
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium">Created:</span>{' '}
            {new Date(project.createdAt).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Updated:</span>{' '}
            {new Date(project.updatedAt).toLocaleString()}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetailsModal;
