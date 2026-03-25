import { SignInForm } from "@/components/pages/auth/SignInForm"

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams

  return (
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-4">
      <SignInForm next={params.next} />
    </main>
  )
}
