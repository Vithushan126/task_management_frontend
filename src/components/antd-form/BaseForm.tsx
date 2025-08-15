'use client';

import { Form } from 'antd';
import type { ReactNode } from 'react';

interface BaseFormProps {
  form: any;
  onFinish: (values: any) => void;
  children: ReactNode;
  layout?: 'horizontal' | 'vertical' | 'inline';
  className?: string;
}

const BaseForm = ({
  form,
  onFinish,
  children,
  layout = 'vertical',
  className = '',
}: BaseFormProps) => {
  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout={layout}
      className={className}
    >
      {children}
    </Form>
  );
};

export default BaseForm;
