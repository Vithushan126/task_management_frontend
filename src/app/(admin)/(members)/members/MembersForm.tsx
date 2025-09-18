// 'use client';

// import { Button, Form } from 'antd';
// import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// import dayjs from 'dayjs';
// import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';

// import BaseForm from '@/components/antd-form/BaseForm';
// import BaseInput from '@/components/antd-form/BaseInput';
// import BaseSelect from '@/components/antd-form/BaseSelect';
// import BaseTextArea from '@/components/antd-form/BaseTextArea';

// type MembersFormProps = {
//   onSubmit: (values: any) => void;
//   initialValues?: any;
//   onFinishModalClose?: () => void;
// };

// const MembersForm = forwardRef(
//   ({ onSubmit, initialValues, onFinishModalClose }: MembersFormProps, ref) => {
//     console.log('initialValues', initialValues);

//     const dispatch = useAppDispatch();

//     const [form] = Form.useForm();

//     useImperativeHandle(ref, () => ({
//       resetForm: () => form.resetFields(),
//     }));

//     useEffect(() => {
//       if (initialValues) {
//         const clonedValues = { ...initialValues };

//         form.setFieldsValue(clonedValues);
//       } else {
//         form.resetFields();
//       }
//     }, [initialValues, form, dispatch]);

//     const handleFinish = (values: any) => {
//       console.log('values', values);

//       onSubmit(values);

//       // onFinishModalClose?.();
//     };

//     const handleClose = () => {
//       form.resetFields();
//       onFinishModalClose?.();
//     };

//     const roleOption = [
//       { label: 'Admin', value: 'admin' },
//       { label: 'Member', value: 'member' },
//       { label: 'Guest', value: 'guest' },
//     ];

//     return (
//       <BaseForm
//         form={form}
//         onFinish={handleFinish}
//         className="grid grid-cols-1 lg:grid-cols-2 gap-1"
//       >
//         <BaseInput
//           name="email"
//           label="Email"
//           required
//           placeholder="Email,comma or space seperated"
//           type="email"
//         />

//         <BaseSelect
//           name="role"
//           label="Role"
//           placeholder="Select the Role"
//           options={roleOption}
//           required
//         />

//         <BaseTextArea
//           name="message"
//           label="Message"
//           rows={2}
//           placeholder="Enter the Message"
//         />

//         <Form.Item className="col-span-full">
//           <div className="flex justify-end space-x-2">
//             <Button onClick={handleClose}>Close</Button>
//             <Button type="primary" htmlType="submit">
//               Submit
//             </Button>
//           </div>
//         </Form.Item>
//       </BaseForm>
//     );
//   },
// );

// MembersForm.displayName = 'MembersForm';

// export default MembersForm;

'use client';

import { Button, Form, Tag, Input } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux';

import BaseForm from '@/components/antd-form/BaseForm';
import BaseInput from '@/components/antd-form/BaseInput';
import BaseSelect from '@/components/antd-form/BaseSelect';
import BaseTextArea from '@/components/antd-form/BaseTextArea';

type MembersFormProps = {
  onSubmit: (values: any) => void;
  initialValues?: any;
  onFinishModalClose?: () => void;
};

// Custom Email Tags Input Component
const EmailTagsInput = ({
  value = [],
  onChange,
  placeholder,
  ...props
}: any) => {
  const [inputValue, setInputValue] = useState('');
  const [emails, setEmails] = useState<string[]>(value || []);

  useEffect(() => {
    if (
      Array.isArray(value) &&
      JSON.stringify(value) !== JSON.stringify(emails)
    ) {
      setEmails(value);
    }
  }, [value, emails]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);

    // Check for comma or space to add email
    if (inputVal.includes(',') || inputVal.includes(' ')) {
      const newEmails = inputVal
        .split(/[,\s]+/)
        .map((email) => email.trim())
        .filter((email) => email && isValidEmail(email));

      if (newEmails.length > 0) {
        const updatedEmails = [...emails, ...newEmails];
        const uniqueEmails = [...new Set(updatedEmails)]; // Remove duplicates
        setEmails(uniqueEmails);
        onChange?.(uniqueEmails);
        setInputValue('');
      } else {
        // Keep the input if no valid emails found
        const cleanInput = inputVal.replace(/[,\s]+$/, '');
        setInputValue(cleanInput);
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const email = inputValue.trim();
      if (isValidEmail(email) && !emails.includes(email)) {
        const updatedEmails = [...emails, email];
        setEmails(updatedEmails);
        onChange?.(updatedEmails);
        setInputValue('');
      }
    } else if (e.key === 'Backspace' && !inputValue && emails.length > 0) {
      // Remove last email when backspace is pressed on empty input
      const updatedEmails = emails.slice(0, -1);
      setEmails(updatedEmails);
      onChange?.(updatedEmails);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(updatedEmails);
    onChange?.(updatedEmails);
  };

  const handleInputBlur = () => {
    // Add email on blur if it's valid
    if (inputValue.trim() && isValidEmail(inputValue.trim())) {
      const email = inputValue.trim();
      if (!emails.includes(email)) {
        const updatedEmails = [...emails, email];
        setEmails(updatedEmails);
        onChange?.(updatedEmails);
      }
      setInputValue('');
    }
  };

  return (
    <div className="w-full">
      <div className="min-h-[32px] p-1 border border-gray-300 rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <div className="flex flex-wrap gap-1 items-center">
          {emails.map((email, index) => (
            <Tag
              key={index}
              closable
              onClose={() => handleRemoveEmail(email)}
              className="m-0"
              color="blue"
            >
              {email}
            </Tag>
          ))}
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onBlur={handleInputBlur}
            placeholder={emails.length === 0 ? placeholder : ''}
            variant="borderless"
            className="flex-1 min-w-[120px] shadow-none"
            style={{
              padding: 0,
              minHeight: '22px',
              boxShadow: 'none',
            }}
            {...props}
          />
        </div>
      </div>
      {emails.length > 0 && (
        <div className="text-xs text-gray-500 mt-1">
          {emails.length} email{emails.length !== 1 ? 's' : ''} added
        </div>
      )}
    </div>
  );
};

const MembersForm = forwardRef(
  ({ onSubmit, initialValues, onFinishModalClose }: MembersFormProps, ref) => {
    console.log('initialValues', initialValues);

    const dispatch = useAppDispatch();
    const [form] = Form.useForm();

    useImperativeHandle(ref, () => ({
      resetForm: () => form.resetFields(),
    }));

    useEffect(() => {
      if (initialValues) {
        const clonedValues = { ...initialValues };

        // Ensure emails is an array
        if (clonedValues.emails && typeof clonedValues.emails === 'string') {
          clonedValues.emails = clonedValues.emails
            .split(',')
            .map((email: string) => email.trim());
        }

        form.setFieldsValue(clonedValues);
      } else {
        form.resetFields();
      }
    }, [initialValues, form, dispatch]);

    const handleFinish = (values: any) => {
      console.log('Form values:', values);

      // Ensure emails is always an array
      const processedValues = {
        ...values,
        emails: values.emails || [],
      };

      console.log('Processed values with email array:', processedValues);
      onSubmit(processedValues);
    };

    const handleClose = () => {
      form.resetFields();
      onFinishModalClose?.();
    };

    const roleOption = [
      { label: 'Admin', value: 'admin' },
      { label: 'Member', value: 'member' },
      { label: 'Guest', value: 'guest' },
    ];

    return (
      <BaseForm
        form={form}
        onFinish={handleFinish}
        className="grid grid-cols-1 lg:grid-cols-2 gap-1"
      >
        <Form.Item
          name="emails"
          label="Emails"
          rules={[
            // { required: true, message: 'Please add at least one email' },
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(
                    new Error('Please add at least one email'),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          className="col-span-full lg:col-span-1"
        >
          <EmailTagsInput placeholder="Enter emails separated by comma or space" />
        </Form.Item>

        <BaseSelect
          name="role"
          label="Role"
          placeholder="Select the Role"
          options={roleOption}
          required
        />

        <BaseTextArea
          name="message"
          label="Message"
          rows={2}
          placeholder="Enter the Message"
          // className="col-span-full"
        />

        <Form.Item className="col-span-full">
          <div className="flex justify-end space-x-2">
            <Button onClick={handleClose}>Close</Button>
            <Button type="primary" htmlType="submit">
              Send Invite
            </Button>
          </div>
        </Form.Item>
      </BaseForm>
    );
  },
);

MembersForm.displayName = 'MembersForm';

export default MembersForm;
