import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { UserProfile } from "@/features/settings/interfaces/profile";

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const user: UserProfile = {
    id: session.user.id,
    name: session.user.name || "User",
    email: session.user.email,
    image: session.user.image,
  };

  return (
    <div className="container mx-auto py-10 px-4 min-h-[calc(100vh-var(--header-height)-2rem)] flex items-center justify-center">
      <ProfileForm user={user} />
    </div>
  );
}
