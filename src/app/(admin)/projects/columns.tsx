import { ColumnsType } from 'antd/es/table';
import { Button, Popconfirm, Tag, Tooltip, Progress, Avatar } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import type { Project } from '@/types/project';
import { ProjectStatus } from '@/types/project';

export const getProjectColumns = (
  getColumnSearchProps: ReturnType<
    typeof useColumnSearch<Project>
  >['getColumnSearchProps'],
  handleEdit: (project: Project) => void,
  handleDelete: (id: string) => void,
  handleViewDetails: (project: Project) => void,
  handleManageMembers: (project: Project) => void,
): ColumnsType<Project> => [
  {
    title: 'Project',
    dataIndex: 'name',
    fixed: 'left',
    width: 280,
    ...getColumnSearchProps('name'),
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
          {record.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-medium text-gray-800 dark:text-white/90 text-sm">
            {record.name}
          </div>
          {record.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {record.description.length > 40
                ? `${record.description.substring(0, 40)}...`
                : record.description}
            </div>
          )}
          <div className="text-xs text-gray-400 mt-1">
            {record.workspace?.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    width: 180,
    render: (owner) => (
      <div className="flex items-center gap-2">
        <Avatar size="small" className="bg-gray-500">
          {owner?.firstName?.charAt(0)}
          {owner?.lastName?.charAt(0)}
        </Avatar>
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-white/90">
            {`${owner?.firstName} ${owner?.lastName}`}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {owner?.email}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 120,
    render: (status: ProjectStatus) => {
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

      return (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status.replace('_', ' ')}
        </Tag>
      );
    },
  },
  {
    title: 'Priority',
    dataIndex: 'priority',
    width: 100,
    render: (priority: string) => {
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
        <Tag color={getPriorityColor(priority)} className="capitalize">
          {priority}
        </Tag>
      );
    },
  },
  {
    title: 'Progress',
    dataIndex: 'progress',
    width: 120,
    render: (progress) => (
      <Progress
        percent={progress?.percentage || 0}
        size="small"
        strokeColor={{
          '0%': '#108ee9',
          '100%': '#87d068',
        }}
      />
    ),
  },
  {
    title: 'Members',
    dataIndex: 'memberCount',
    width: 100,
    render: (count, record) => (
      <div className="flex items-center gap-2">
        <Avatar.Group size="small" max={{ count: 3 }}>
          {record.members?.slice(0, 3).map((member) => (
            <Avatar key={member.id} className="bg-gray-500">
              {member.user.firstName.charAt(0)}
              {member.user.lastName.charAt(0)}
            </Avatar>
          ))}
        </Avatar.Group>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {count || 0}
        </span>
      </div>
    ),
  },
  {
    title: 'Tasks',
    dataIndex: 'taskCount',
    width: 80,
    render: (count, record) => (
      <div className="text-center">
        <div className="text-sm font-medium text-gray-800 dark:text-white/90">
          {count || 0}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {record.completedTasks || 0} done
        </div>
      </div>
    ),
  },
  {
    title: 'Dates',
    dataIndex: 'startDate',
    width: 140,
    render: (_, record) => (
      <div className="text-xs">
        {record.startDate && (
          <div className="text-gray-600 dark:text-gray-300">
            Start: {new Date(record.startDate).toLocaleDateString()}
          </div>
        )}
        {record.endDate && (
          <div className="text-gray-600 dark:text-gray-300">
            End: {new Date(record.endDate).toLocaleDateString()}
          </div>
        )}
      </div>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 160,
    render: (_, record) => (
      <div className="flex items-center gap-1">
        <Tooltip title="View Details">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
            className="text-blue-600 hover:text-blue-700"
          />
        </Tooltip>
        <Tooltip title="Edit Project">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-green-600 hover:text-green-700"
          />
        </Tooltip>
        <Tooltip title="Manage Members">
          <Button
            type="text"
            size="small"
            icon={<UserAddOutlined />}
            onClick={() => handleManageMembers(record)}
            className="text-purple-600 hover:text-purple-700"
          />
        </Tooltip>
        <Popconfirm
          title="Delete Project"
          description="Are you sure you want to delete this project? This action cannot be undone."
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete Project">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              className="text-red-600 hover:text-red-700"
            />
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];
