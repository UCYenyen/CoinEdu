import { SignUpForm } from "@/components/pages/auth/SignUpFrom"

export default function SignUpPage() {
  return (
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-4">
      <SignUpForm />
    </main>
  )
}
