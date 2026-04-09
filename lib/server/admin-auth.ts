import 'server-only'

import { auth, clerkClient } from '@clerk/nextjs/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase()).filter(Boolean)

function debugLog(message: string, details?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    return
  }

  if (details) {
    console.info(`[admin-auth] ${message}`, details)
    return
  }

  console.info(`[admin-auth] ${message}`)
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const { userId } = await auth()

  debugLog('auth() resolved', { userId: userId ?? null, adminEmailsConfigured: ADMIN_EMAILS })

  if (!userId) {
    debugLog('no userId found, treating as unauthenticated')
    return false
  }

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  debugLog('loaded clerk user', {
    userId,
    primaryEmail: user.emailAddresses?.[0]?.emailAddress ?? null,
    emails: user.emailAddresses?.map((emailAddress) => emailAddress.emailAddress) ?? [],
    publicMetadata: user.publicMetadata,
  })

  // Check if user email is in admin list
  const userEmail = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()

  if (userEmail && ADMIN_EMAILS.length > 0 && ADMIN_EMAILS.includes(userEmail)) {
    debugLog('admin access granted via admin email allowlist', { userId, userEmail })
    return true
  }

  // Fallback: check metadata for admin role (for future flexibility)
  if (user.publicMetadata?.role === 'admin') {
    debugLog('admin access granted via public metadata role', { userId, userEmail })
    return true
  }

  debugLog('admin access denied', {
    userId,
    userEmail,
    reason: ADMIN_EMAILS.length === 0 ? 'configure ADMIN_EMAILS or set Clerk metadata role=admin' : 'not in allowlist',
  })
  return false
}
