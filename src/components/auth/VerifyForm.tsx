'use client';

import React, { useState } from 'react';
import { Button, Form } from 'antd';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/use-redux';
import { verifyEmail } from '@/redux/feature/auth/auth-thunk';
import { useSearchParams } from 'next/navigation';

export default function VerifyForm() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  const onFinish = async (values: any) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }
    try {
      setLoading(true);
      const res = await dispatch(verifyEmail({ token })).unwrap();
      toast.success(res.message || 'Verification successful!');

      form.resetFields();
    } catch (err: any) {
      toast.error(err?.message || 'Verification failed');
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
              Verify Your Email address?
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Please confirm that you want to use this as your email address. If
              successful, your login credentials will be sent to this email.
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
              <Form.Item>
                <Button
                  type="primary"
                  size="large"
                  className="w-full"
                  htmlType="submit"
                  loading={loading}
                >
                  Continue
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
