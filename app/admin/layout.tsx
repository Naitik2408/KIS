import type { ReactNode } from 'react'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isCurrentUserAdmin } from '@/lib/server/admin-auth'
import Link from 'next/link'

export default async function AdminRouteLayout({
  children,
}: {
  children: ReactNode
}) {
  const { userId } = await auth()

  if (process.env.NODE_ENV !== 'production') {
    console.info('[admin-layout] route requested', { userId: userId ?? null })
  }

  if (!userId) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[admin-layout] no session found, redirecting to /sign-in')
    }
    redirect('/sign-in')
  }

  const isAdmin = await isCurrentUserAdmin()

  if (process.env.NODE_ENV !== 'production') {
    console.info('[admin-layout] admin check result', { userId, isAdmin })
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-10 bg-background">
        <div className="max-w-md w-full rounded-lg border border-border bg-card p-6 text-center space-y-4">
          <h1 className="text-xl font-semibold">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            Only admin users can access this page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
