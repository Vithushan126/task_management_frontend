import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign In | InvicTask - Project & Task Management Platform",
  description:
    "Access your InvicTask account to manage projects, tasks, teams, and workflows efficiently with our all-in-one management platform.",
};


export default function Home() {
  redirect("/signin");
}
