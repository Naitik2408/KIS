'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, LayoutDashboard, Package, Shapes, LogOut, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    const updateViewport = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      setSidebarOpen(!mobile)
    }

    updateViewport()
    window.addEventListener('resize', updateViewport)
    return () => window.removeEventListener('resize', updateViewport)
  }, [])

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Products', href: '/admin/products', icon: Package },
    { label: 'Categories', href: '/admin/categories', icon: Shapes },
  ]

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-linear-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      {isMobile && sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] lg:hidden"
        />
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`${sidebarOpen ? 'lg:w-64' : 'lg:w-20'} relative hidden lg:flex flex-col border-r border-slate-700/50 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 transition-all duration-300`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(14,165,233,0.16),transparent_45%)]" />

        {/* Logo Section */}
        <div className="relative h-16 flex items-center justify-between px-4 border-b border-slate-700/70">
          <div className={`flex items-center gap-2 ${!sidebarOpen && 'hidden'}`}>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/20 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <h1 className="font-bold text-base tracking-wide">Krishna Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 hover:bg-slate-800 rounded-md transition"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-cyan-400/20 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.35)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="relative p-4 border-t border-slate-700/70 space-y-2">
          <Link href="/">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && 'Back to Site'}
            </Button>
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] lg:hidden flex flex-col border-r border-slate-700/50 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="pointer-events-none absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_85%,rgba(14,165,233,0.16),transparent_45%)]" />

        <div className="relative h-16 flex items-center justify-between px-4 border-b border-slate-700/70">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-cyan-400/20 text-cyan-300">
              <Sparkles className="h-4 w-4" />
            </span>
            <h1 className="font-bold text-base tracking-wide">Krishna Admin</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 hover:bg-slate-800 rounded-md transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-cyan-400/20 text-white shadow-[inset_0_0_0_1px_rgba(56,189,248,0.35)]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              </Link>
            )
          })}
        </nav>

        <div className="relative p-4 border-t border-slate-700/70 space-y-2">
          <Link href="/" onClick={() => setSidebarOpen(false)}>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 border-slate-600 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white"
              size="sm"
            >
              <LogOut className="w-4 h-4" />
              Back to Site
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-4 sm:px-6">
          <div className="flex items-center justify-between w-full">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {isMobile && (
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className="inline-flex lg:hidden items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-sm"
                    aria-label="Open sidebar"
                  >
                    <Menu className="w-4 h-4" />
                  </button>
                )}
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                  {pathname === '/admin'
                    ? 'Dashboard'
                    : pathname === '/admin/products'
                    ? 'Products Management'
                    : pathname === '/admin/categories'
                    ? 'Categories Management'
                    : 'Admin Panel'}
                </h2>
              </div>
              <p className="hidden sm:block text-xs text-slate-500">Operational control center</p>
            </div>
            <div className="hidden sm:inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 min-w-0">{children}</div>
        </main>
      </div>
    </div>
  )
}
