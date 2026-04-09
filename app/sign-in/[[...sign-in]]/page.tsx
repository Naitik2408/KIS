import { SignIn } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'

export default async function SignInPage() {
  const { userId } = await auth()

  if (process.env.NODE_ENV !== 'production') {
    console.info('[sign-in] page requested', { userId: userId ?? null })
  }

  if (userId) {
    const isAdmin = await isCurrentUserAdmin()

    if (process.env.NODE_ENV !== 'production') {
      console.info('[sign-in] signed-in session detected', { userId, isAdmin })
    }

    if (isAdmin) {
      if (process.env.NODE_ENV !== 'production') {
        console.info('[sign-in] redirecting admin user to /admin', { userId })
      }
      redirect('/admin')
    }

    if (process.env.NODE_ENV !== 'production') {
      console.info('[sign-in] non-admin user detected, redirecting to home', { userId })
    }

    redirect('/')
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
      <SignIn path="/sign-in" routing="path" forceRedirectUrl="/admin" />
    </main>
  )
}
