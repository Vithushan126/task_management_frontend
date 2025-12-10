import { ColumnsType } from 'antd/es/table';
import { Button, Popconfirm, Tag, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  InboxOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import type { Space } from '@/types/space';

export const getSpaceColumns = (
  getColumnSearchProps: ReturnType<
    typeof useColumnSearch<Space>
  >['getColumnSearchProps'],
  handleEdit: (space: Space) => void,
  handleDelete: (id: string) => void,
  handleArchive: (id: string) => void,
  handleManageMembers: (space: Space) => void,
): ColumnsType<Space> => [
  {
    title: 'Space',
    dataIndex: 'name',
    fixed: 'left',
    width: 280,
    ...getColumnSearchProps('name'),
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-lg"
          style={{ backgroundColor: record.color }}
        >
          {record.icon}
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
            {record.workspace.name}
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
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {owner?.firstName?.charAt(0)}
            {owner?.lastName?.charAt(0)}
          </span>
        </div>
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
    title: 'Visibility',
    dataIndex: 'visibility',
    width: 100,
    render: (visibility: string) => {
      const getVisibilityColor = (vis: string) => {
        switch (vis) {
          case 'public':
            return 'green';
          case 'internal':
            return 'blue';
          case 'private':
            return 'orange';
          default:
            return 'default';
        }
      };

      return (
        <Tag color={getVisibilityColor(visibility)} className="capitalize">
          {visibility}
        </Tag>
      );
    },
  },
  {
    title: 'Status',
    dataIndex: 'status',
    width: 100,
    render: (status: string, record) => (
      <div className="flex flex-col gap-1">
        <Tag color={status === 'active' ? 'green' : 'red'}>{status}</Tag>
        {record.isArchived && (
          <Tag color="orange" className="text-xs">
            Archived
          </Tag>
        )}
      </div>
    ),
  },
  {
    title: 'Members',
    dataIndex: 'memberCount',
    width: 80,
    render: (count) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {count || 0}
      </span>
    ),
  },
  {
    title: 'Folders',
    dataIndex: 'folderCount',
    width: 80,
    render: (count) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {count || 0}
      </span>
    ),
  },
  {
    title: 'Tasks',
    dataIndex: 'taskCount',
    width: 80,
    render: (count) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {count || 0}
      </span>
    ),
  },
  {
    title: 'Created',
    dataIndex: 'createdAt',
    width: 120,
    render: (date: string) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {new Date(date).toLocaleDateString()}
      </span>
    ),
  },
  {
    title: 'Actions',
    key: 'actions',
    fixed: 'right',
    width: 140,
    render: (_, record) => (
      <div className="flex items-center gap-1">
        <Tooltip title="View Details">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            className="text-blue-600 hover:text-blue-700"
          />
        </Tooltip>
        <Tooltip title="Edit Space">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-green-600 hover:text-green-700"
          />
        </Tooltip>
        <Tooltip title={record.isArchived ? 'Unarchive' : 'Archive'}>
          <Button
            type="text"
            size="small"
            icon={<InboxOutlined />}
            onClick={() => handleArchive(record.id)}
            className="text-orange-600 hover:text-orange-700"
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
          title="Delete Space"
          description="Are you sure you want to delete this space? This action cannot be undone."
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip
            title="Delete Space"
            styles={{
              body: {
                backgroundColor: 'red',
                color: 'white',
              },
            }}
          >
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
