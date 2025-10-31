import { Form, Input } from 'antd';

interface BaseInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  rules?: any[];
  type?: string;
}

const BaseInput = ({
  name,
  label,
  placeholder = '',
  required = false,
  rules = [],
  type = 'text',
}: BaseInputProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        ...(required
          ? [{ required: true, message: `Please enter ${label}` }]
          : []),
        ...rules,
      ]}
    >
      <Input placeholder={placeholder} type={type} />
    </Form.Item>
  );
};

export default BaseInput;
