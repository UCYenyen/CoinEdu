import { SignInForm } from "@/components/pages/auth/SignInForm"

export default function SignInPage() {
  return (
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-4">
      <SignInForm />
    </main>
  )
}
