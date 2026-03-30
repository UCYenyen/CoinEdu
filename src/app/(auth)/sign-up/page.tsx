import { SignUpForm } from "@/components/pages/auth/SignUpForm"

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const params = await searchParams

  return (
    <main className="flex min-h-[calc(100svh-var(--header-height))] items-center justify-center p-4">
      <SignUpForm next={params.next} />
    </main>
  )
}
