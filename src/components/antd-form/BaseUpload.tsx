'use client';

import { Upload, Form, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload';
import React from 'react';

type BaseUploadProps = {
  name: string;
  label?: string;
  required?: boolean;
  maxCount?: number;
  listType?: 'text' | 'picture' | 'picture-card';
};

const beforeUpload = (file: RcFile) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isImage) {
    message.error('You can only upload image files!');
  }
  if (!isLt2M) {
    message.error('Image must be smaller than 2MB!');
  }

  return isImage && isLt2M;
};

// const normFile = (e: UploadChangeParam<UploadFile<any>>) => {
//   if (Array.isArray(e)) {
//     return e;
//   }
//   return e?.fileList ;
// };

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList || [];
};

const BaseUpload: React.FC<BaseUploadProps> = ({
  name,
  label,
  required = false,
  maxCount = 1,
  listType = 'picture',
}) => {
  return (
    <Form.Item
      className="w-full"
      name={name}
      label={label}
      valuePropName="fileList"
      getValueFromEvent={normFile}
      rules={
        required
          ? [{ required: true, message: `${label || 'File'} is required` }]
          : undefined
      }
    >
      <Upload
        name="file"
        listType={listType}
        beforeUpload={beforeUpload}
        maxCount={maxCount}
        style={{ display: 'block', width: '100%' }}
      >
        <Button
          icon={<UploadOutlined />}
          className="w-full"
          style={{ width: '100%' }}
        >
          Click to Upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default BaseUpload;
