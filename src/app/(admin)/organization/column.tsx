'use client';

import type { ColumnsType } from 'antd/es/table';
import { Button, Image, message, Tag } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import toast from 'react-hot-toast';
import { ActionCell } from '@/components/common/table';
import { Organization } from '@/types';
import useColumnSearch from '@/components/common/table/useColumnSearch';

export const getOrganizationColumns = (
  getColumnSearchProps: ReturnType<
    typeof useColumnSearch<Organization>
  >['getColumnSearchProps'],
  handleEdit: (org: Organization) => void,
  handleDelete: (id: number) => void,
): ColumnsType<Organization> => [
  {
    title: 'Organization Name',
    dataIndex: 'name',
    fixed: 'left',
    width: 250,
    ...getColumnSearchProps('name'),
    render: (_, record) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
          <Image
            width={40}
            height={40}
            src={record?.logo || '/images/organization/Organization.png'}
            alt={record?.name}
          />
        </div>
        <span className="block font-medium text-gray-800 dark:text-white/90 text-theme-sm text-nowrap">
          {record?.name}
        </span>
      </div>
    ),
  },
  {
    title: 'Owner',
    width: 200,
    render: (_, record) => {
      const owner = record?.owner;
      return (
        <div className="flex flex-row gap-2">
          <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-100">
            <Image
              width={40}
              height={40}
              src={owner?.avatar || '/images/user/User.svg'}
              alt={owner?.firstName}
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-800 dark:text-white/90 text-theme-sm font-medium text-nowrap">
              {owner.firstName} {owner.lastName}
            </span>
            <span className="text-gray-500 dark:text-white/60 text-xs">
              {owner.email}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    title: 'Contact Number',
    width: 200,
    dataIndex: 'owner',
    render: (_, record) => {
      const owner = record?.owner;
      return (
        <span className="text-gray-800 dark:text-white/90 text-theme-sm">
          {owner.contactNumber}
        </span>
      );
    },
  },
  {
    title: 'Registered On',
    width: 150,
    dataIndex: 'createdAt',
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Industry',
    width: 150,
    dataIndex: 'industry',
  },
  {
    title: 'Member Count',
    dataIndex: 'memberCount',
  },
  {
    title: 'Workspace Count',
    dataIndex: 'workspaceCount',
  },
  {
    title: 'Status',
    width: 100,
    dataIndex: 'status',
    filters: [
      { text: 'Active', value: 'active' },
      { text: 'Inactive', value: 'inactive' },
      { text: 'Pending', value: 'pending' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status?: string) => {
      const colorMap: Record<string, string> = {
        active: 'green',
        inactive: 'red',
        pending: 'orange',
      };

      return (
        <Tag color={colorMap[status || ''] || 'default'}>
          {(status || 'Unknown').toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: 'Actions',
    width: 80,
    key: 'actions',
    fixed: 'right',
    render: (_, record) => (
      <ActionCell
        onEdit={() => handleEdit(record)}
        showDelete={false}
        // onDelete={() => record.id !== undefined && handleDelete(record.id)}
      />
    ),
  },
];
