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
            src={record?.imageUrl || '/images/user/default-user.jpg'}
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
    title: 'Contact Email',
    width: 200,
    // dataIndex: ['users', 0, 'email'],
    // ...getColumnSearchProps('users'),
    render: (_, record) => {
      if (!record || !record.users || !Array.isArray(record.users)) {
        return (
          <span className="text-gray-800 dark:text-white/90 text-theme-sm">
            N/A
          </span>
        );
      }

      const email = record.users[0]?.email || 'N/A';
      return (
        <span className="text-gray-800 dark:text-white/90 text-theme-sm text-nowrap">
          {email}
        </span>
      );
    },
  },
  // {
  //   title: 'Contact Email',
  //    dataIndex: ['users', 0, 'email'],
  //    ...getColumnSearchProps('users'),
  //   render: (_, record) => {
  //     const email = record.users?.[0]?.email || '';
  //     return (
  //       <span className="text-gray-800 dark:text-white/90 text-theme-sm">{email}</span>
  //     )
  //   },
  // },
  {
    title: 'Contact Number',
    width: 150,
    dataIndex: 'contactNumber',
    ...getColumnSearchProps('contactNumber'),
  },
  {
    title: 'Address',
    width: 150,
    dataIndex: 'address',
    ...getColumnSearchProps('address'),
  },
  {
    title: 'Registered On',
    width: 150,
    dataIndex: 'registrationDate',
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: 'Organization Url',
    dataIndex: 'loginUrl',
    width: 300,
    render: (text: string) => (
      <div className="flex items-center justify-between gap-2">
        <span className="truncate max-w-[200px]" title={text}>
          {text}
        </span>
        <Button
          icon={<CopyOutlined />}
          size="small"
          onClick={() => {
            navigator.clipboard
              .writeText(text)
              .then(() => {
                toast.success('Copied to clipboard!');
              })
              .catch(() => {
                console.log('Failed to copy.');
              });
          }}
        />
      </div>
    ),
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
