import { Form, Select } from 'antd';

interface Option {
  label: string;
  value: string | number;
}

interface BaseMultiSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: (string | number)[]) => void;
}

const BaseMultiSelect = ({
  name,
  label,
  options,
  placeholder = '',
  required = false,
  onChange,
}: BaseMultiSelectProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={
        required
          ? [{ required: true, message: `Please select at least one ${label}` }]
          : []
      }
    >
      <Select
        mode="multiple"
        allowClear
        placeholder={placeholder}
        onChange={onChange}
      >
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value}>
            {opt.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default BaseMultiSelect;
