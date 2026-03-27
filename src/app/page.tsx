'use client'

import { useRouter } from "next/navigation";

export default function Root() {
  const router = useRouter();
  router.push("/dashboard");
}