import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up | InvicTask - Project & Task Management Platform",
  description:
    "Create your InvicTask account to start managing projects, tasks, teams, and productivity — all in one collaborative platform.",
};


export default function SignUp() {
  return <SignUpForm />;
}
