import ResetForm from '@/components/auth/ResetForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    'InvicTask reset-password | InvicTask - Project & Task Management Platform',
  description:
    'Access your InvicTask account to manage projects, tasks, teams, and workflows efficiently with our all-in-one management platform.',
};

export default function SignIn() {
  return <ResetForm />;
}
