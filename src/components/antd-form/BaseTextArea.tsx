import { Form, Input } from 'antd';

interface BaseTextAreaProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rules?: any[];
  rows?: number;
}

const BaseTextArea = ({
  name,
  label,
  placeholder = '',
  required = false,
  rules = [],
  rows = 4,
}: BaseTextAreaProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        ...(required ? [{ required: true, message: `Please enter ${label}` }] : []),
        ...rules,
      ]}
    >
      <Input.TextArea placeholder={placeholder} rows={rows} />
    </Form.Item>
  );
};

export default BaseTextArea;
