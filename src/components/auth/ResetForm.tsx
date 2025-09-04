'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { Button, Form } from 'antd';
import toast from 'react-hot-toast';

import Input from '@/components/form/input/InputField';
import Label from '@/components/form/Label';
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from '@/icons';
import { useAppDispatch } from '@/hooks/use-redux';
import { forgotPassword } from '@/redux/feature/auth/auth-thunk';

export default function ResetForm() {
  const dispatch = useAppDispatch();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      console.log(values);

      const res = await dispatch(forgotPassword(values)).unwrap();
      console.log(res);
      toast.success(res.message || 'Login successful!');

      form.resetFields();
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Forgot Your Password?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter the email address linked to your account, and we’ll send you
              a link to reset your password.
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
                name="email"
                label={
                  <Label>
                    Email <span className="text-error-500">*</span>
                  </Label>
                }
                rules={[
                  { required: true, message: 'Please enter your email' },
                  { type: 'email', message: 'Invalid email' },
                ]}
              >
                <Input placeholder="Enter your Email" type="email" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  htmlType="submit"
                  loading={loading}
                >
                  Send Reset Link
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
