import { ColumnsType } from 'antd/es/table';
import { Button, Popconfirm, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import Image from 'next/image';
import useColumnSearch from '@/components/common/table/useColumnSearch';
import type { Workspace } from '@/types/workspace';

export const getWorkspaceColumns = (
  getColumnSearchProps: ReturnType<
    typeof useColumnSearch<Workspace>
  >['getColumnSearchProps'],
  handleEdit: (workspace: Workspace) => void,
  handleDelete: (id: string) => void,
): ColumnsType<Workspace> => [
  {
    title: 'Workspace Name',
    dataIndex: 'name',
    fixed: 'left',
    width: 250,
    ...getColumnSearchProps('name'),
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {record.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <span className="block font-medium text-gray-800 dark:text-white/90 text-sm">
            {record.name}
          </span>
          {record.description && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {record.description.length > 30 
                ? `${record.description.substring(0, 30)}...` 
                : record.description}
            </span>
          )}
        </div>
      </div>
    ),
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    width: 200,
    render: (owner) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {owner?.firstName?.charAt(0)}{owner?.lastName?.charAt(0)}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-800 dark:text-white/90">
            {owner?.displayName || `${owner?.firstName} ${owner?.lastName}`}
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
    width: 120,
    render: (visibility: string) => {
      const getVisibilityColor = (vis: string) => {
        switch (vis) {
          case 'public': return 'green';
          case 'internal': return 'blue';
          case 'private': return 'orange';
          default: return 'default';
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
    title: 'Members',
    dataIndex: 'memberCount',
    width: 100,
    render: (count) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {count || 0}
      </span>
    ),
  },
  {
    title: 'Projects',
    dataIndex: 'projectCount',
    width: 100,
    render: (count) => (
      <span className="text-sm text-gray-600 dark:text-gray-300">
        {count || 0}
      </span>
    ),
  },
  {
    title: 'Status',
    dataIndex: 'isActive',
    width: 100,
    render: (isActive: boolean) => (
      <Tag color={isActive ? 'green' : 'red'}>
        {isActive ? 'Active' : 'Inactive'}
      </Tag>
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
    width: 120,
    render: (_, record) => (
      <div className="flex items-center gap-2">
        <Button
          type="text"
          size="small"
          icon={<EyeOutlined />}
          className="text-blue-600 hover:text-blue-700"
          title="View Details"
        />
        <Button
          type="text"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="text-green-600 hover:text-green-700"
          title="Edit Workspace"
        />
        <Popconfirm
          title="Delete Workspace"
          description="Are you sure you want to delete this workspace?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            size="small"
            icon={<DeleteOutlined />}
            className="text-red-600 hover:text-red-700"
            title="Delete Workspace"
          />
        </Popconfirm>
      </div>
    ),
  },
];