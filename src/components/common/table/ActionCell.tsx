'use client';

import { Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

type Props = {
  onEdit: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
  deleteDisabled?: boolean;
};

export default function ActionCell({
  onEdit,
  onDelete,
  showDelete = true,
  deleteDisabled = false,
}: Props) {
  return (
    <Space>
      <Button
        type="primary"
        icon={<EditOutlined />}
        size="small"
        onClick={onEdit}
      />
      {showDelete && onDelete && (
        <Popconfirm
          title="Are you sure you want to delete?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
          disabled={deleteDisabled}
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            disabled={deleteDisabled}
          />
        </Popconfirm>
      )}
    </Space>
  );
}
