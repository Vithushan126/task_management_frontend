'use client';

import type { ColumnsType } from 'antd/es/table';
import type { Members } from '@/types';
import { ActionCell } from '@/components/common/table';
import { Image, Tag } from 'antd';
import type useColumnSearch from '@/components/common/table/useColumnSearch';

export const getEmployeeColumns = (
  getColumnSearchProps: ReturnType<
    typeof useColumnSearch<Members>
  >['getColumnSearchProps'],
  handleEdit: (id: any) => void,
  handleDelete: (id: any) => void,
  selectedFilter?: string, // Add this parameter
): ColumnsType<Members> => {
  const baseColumns: ColumnsType<Members> = [
    {
      title: 'Member',
      dataIndex: 'user',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 overflow-hidden rounded-full">
            <Image
              width={40}
              height={40}
              src={record?.user?.avatar || '/images/user/User.svg'}
              alt={record?.user?.displayName}
            />
          </div>
          <div>
            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 text-nowrap">
              {record?.user?.displayName}
            </span>
            {selectedFilter !== 'pending' && (
              <span className="block text-gray-500 text-theme-xs dark:text-gray-400 text-nowrap">
                {record?.role}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      filters: [
        { text: 'Owner', value: 'owner' },
        { text: 'Member', value: 'member' },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role: string) => {
        const color = role === 'owner' ? 'gold' : 'blue';
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
      width: 120,
    },
    {
      title: 'Email',
      dataIndex: selectedFilter === 'pending' ? 'email' : ['user', 'email'],
      ...(selectedFilter !== 'pending'
        ? getColumnSearchProps('user.email' as any)
        : {}),
      width: 220,
      render: (email: string) => email || '-', // fallback if no email
    },
  ];

  // Conditionally add Joined At column
  if (selectedFilter !== 'pending') {
    baseColumns.push({
      title: 'Joined At',
      dataIndex: 'joinedAt',
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString() : '-',
      width: 160,
    });
  }

  // Add remaining columns
  baseColumns.push(
    {
      title: 'Status',
      dataIndex: 'isActive',
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'ACTIVE' : 'INACTIVE'}
        </Tag>
      ),
      width: 120,
    },
    {
      title: 'Actions',
      width: 80,
      key: 'actions',
      fixed: 'right',
      render: (_, record) => (
        <ActionCell
          onEdit={() => handleEdit(record)}
          onDelete={() => record.id !== undefined && handleDelete(record?.id)}
          showDelete={true}
          deleteDisabled={record.terminationDate !== null}
        />
      ),
    },
  );

  return baseColumns;
};
