import ResetForm from '@/components/auth/ResetForm';
import VerifyForm from '@/components/auth/VerifyForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'InvicTask verify-email | InvicTask - Project & Task Management Platform',
  description:
    'Access your InvicTask account to manage projects, tasks, teams, and workflows efficiently with our all-in-one management platform.',
};

export default function VeverifyEmail() {
  return <VerifyForm />;
}
