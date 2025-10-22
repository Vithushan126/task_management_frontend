import { Form, Select } from 'antd';

interface Option {
  label: string;
  value: string | number;
}

interface BaseSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (value: any) => void;
}

const BaseSelect = ({
  name,
  label,
  options,
  placeholder = '',
  required = false,
  disabled = false,
  onChange,
}: BaseSelectProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={
        required ? [{ required: true, message: `Please select ${label}` }] : []
      }
    >
      <Select placeholder={placeholder} onChange={onChange} disabled={disabled}>
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default BaseSelect;
