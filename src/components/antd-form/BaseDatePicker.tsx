import { Form, DatePicker } from 'antd';
import { DatePickerProps } from 'antd';

interface BaseDatePickerProps extends DatePickerProps {
  name: string;
  label: string;
  required?: boolean;
}

const BaseDatePicker = ({
  name,
  label,
  placeholder = '',
  required = false,
  ...restProps
}: BaseDatePickerProps) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={required ? [{ required: true, message: `Please select ${label}` }] : []}
    >
      <DatePicker
        placeholder={placeholder}
        style={{ width: '100%' }}
        {...restProps}
      />
    </Form.Item>
  );
};

export default BaseDatePicker;
