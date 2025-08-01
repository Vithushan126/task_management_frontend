'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Form } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { useAppDispatch } from '@/hooks/use-redux';
import { reSetPassword } from '@/redux/feature/auth/auth-thunk';

export default function NewPasswordForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  console.log(token);

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onFinish = async (values: any) => {
    if (!token) {
      toast.error('Invalid or missing token.');
      return;
    }

    try {
      setLoading(true);
      console.log(values);
      const payload = {
        token,
        newPassword: values.newPassword, // or values.newPassword if that's the one you want
      };

      const res = await dispatch(reSetPassword(payload)).unwrap();
      console.log(res);
      toast.success(res.message || 'Login successful!');
      router.push('signin');

      form.resetFields();
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Create New Password
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Your new password must be different from previous used password.
            </p>
          </div>
          <div>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark={false}
              className="space-y-6"
            >
              <Form.Item
                name="password"
                label={
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                }
                rules={[
                  { required: true, message: 'Please enter new password' },
                  { min: 6, message: 'Password must be at least 6 characters' },
                ]}
              >
                <div className="relative">
                  <Input
                    placeholder="Enter new password"
                    type={showPassword ? 'text' : 'password'}
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </Form.Item>

              <Form.Item
                name="newPassword"
                label={
                  <Label>
                    Conform Password <span className="text-error-500">*</span>
                  </Label>
                }
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Passwords do not match'),
                      );
                    },
                  }),
                ]}
              >
                <div className="relative">
                  <Input
                    placeholder="Confirm your password"
                    type={showConfirmPassword ? 'text' : 'password'}
                  />
                  <span
                    className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? <EyeIcon /> : <EyeCloseIcon />}
                  </span>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  htmlType="submit"
                  loading={loading}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
