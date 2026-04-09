'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth, useClerk } from '@clerk/nextjs'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { CART_UPDATED_EVENT, getCartItemCount } from '@/lib/cart'

interface NavigationProps {
  onCartOpen: () => void
  overlay?: boolean
}

export default function Navigation({ onCartOpen, overlay = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { isSignedIn } = useAuth()
  const { signOut } = useClerk()

  useEffect(() => {
    const syncCount = () => {
      setCartCount(getCartItemCount())
    }

    syncCount()
    window.addEventListener(CART_UPDATED_EVENT, syncCount)
    window.addEventListener('storage', syncCount)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCount)
      window.removeEventListener('storage', syncCount)
    }
  }, [])

  return (
    <nav className={`sticky top-0 z-50 ${overlay ? 'bg-transparent border-b border-white/20' : 'bg-background border-b border-border'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Krishna Infotech Solutions" className="h-9 w-9 rounded-md object-cover" />
              <div className={`text-sm sm:text-base font-semibold leading-tight ${overlay ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]' : 'text-primary'}`}>
                Krishna Infotech Solutions
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/" className={`transition text-sm font-medium ${overlay ? 'text-white/90 hover:text-white' : 'text-foreground hover:text-primary'}`}>Home</a>
            <a href="/products" className={`transition text-sm font-medium ${overlay ? 'text-white/90 hover:text-white' : 'text-foreground hover:text-primary'}`}>Shop</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <>
              <Link
                href="/admin"
                className={`hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition ${overlay ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-muted'}`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className={`hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition ${overlay ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-muted'}`}
              >
                Logout
              </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className={`hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-medium transition ${overlay ? 'text-white hover:bg-white/15' : 'text-foreground hover:bg-muted'}`}
              >
                Sign In
              </Link>
            )}
            <button
              onClick={onCartOpen}
              className={`p-2 rounded-lg transition relative ${overlay ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
              title="View shopping cart"
            >
              <ShoppingCart className={`w-5 h-5 ${overlay ? 'text-white' : 'text-foreground'}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-foreground text-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition ${overlay ? 'hover:bg-white/15' : 'hover:bg-muted'}`}
            >
              {isMenuOpen ? (
                <X className={`w-5 h-5 ${overlay ? 'text-white' : 'text-foreground'}`} />
              ) : (
                <Menu className={`w-5 h-5 ${overlay ? 'text-white' : 'text-foreground'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden pb-4 space-y-1 border-t ${overlay ? 'border-white/20 bg-black/35 backdrop-blur-sm' : 'border-border'}`}>
            <a href="/" className={`block transition py-3 px-4 rounded-lg ${overlay ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-foreground hover:text-primary hover:bg-muted'}`}>Home</a>
            <a href="/products" className={`block transition py-3 px-4 rounded-lg ${overlay ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-foreground hover:text-primary hover:bg-muted'}`}>Shop</a>
            {isSignedIn ? (
              <>
              <Link href="/admin" className={`block transition py-3 px-4 rounded-lg ${overlay ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-foreground hover:text-primary hover:bg-muted'}`}>
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                className={`w-full text-left block transition py-3 px-4 rounded-lg ${overlay ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-foreground hover:text-primary hover:bg-muted'}`}
              >
                Logout
              </button>
              </>
            ) : (
              <Link href="/sign-in" className={`block transition py-3 px-4 rounded-lg ${overlay ? 'text-white/90 hover:text-white hover:bg-white/15' : 'text-foreground hover:text-primary hover:bg-muted'}`}>
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
