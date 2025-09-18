'use client';

import React, { useState } from 'react';
import { Button, Form } from 'antd';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/use-redux';
import { verifyEmail } from '@/redux/feature/auth/auth-thunk';
import { useRouter, useSearchParams } from 'next/navigation';
import { acceptInvitation } from '@/redux/feature/organization/organization-thunk';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { EyeCloseIcon, EyeIcon } from '@/icons';
import { AcceptInvitationDto } from '@/service/org.api';

export default function AcceptInvitationForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form] = Form.useForm();
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  const onFinish = async (values: any) => {
    if (!token) {
      toast.error('Invalid or missing token');
      return;
    }
    try {
      setLoading(true);
      const payload: AcceptInvitationDto = {
        token,
        ...values,
      };
      const res = await dispatch(acceptInvitation(payload)).unwrap();
      toast.success(res.message || 'Verification successful!');

      form.resetFields();
      router.push('/signin');
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
              Accept Invitation
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have been invited to join this organization. Please confirm to
              accept the invitation.
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
                name="firstName"
                label={
                  <Label>
                    First Name <span className="text-error-500">*</span>
                  </Label>
                }
                rules={[
                  { required: true, message: 'Please enter your first name' },
                ]}
              >
                <Input placeholder="Enter the first name" type="input" />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={
                  <Label>
                    Last Name <span className="text-error-500">*</span>
                  </Label>
                }
                rules={[
                  { required: true, message: 'Please enter your last name' },
                ]}
              >
                <Input placeholder="Enter the last name" type="input" />
              </Form.Item>

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
                <Input placeholder="info@gmail.com" type="email" />
              </Form.Item>

              <Form.Item
                name="password"
                label={
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                }
                rules={[
                  { required: true, message: 'Please enter your password' },
                ]}
              >
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
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
                  Join Organization
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
