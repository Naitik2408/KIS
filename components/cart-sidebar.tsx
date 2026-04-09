'use client'

import { useEffect, useMemo, useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import {
  CART_UPDATED_EVENT,
  type CartItem,
  readCart,
  removeFromCart,
  updateCartItemQuantity,
} from '@/lib/cart'

interface CartSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const OWNER_WHATSAPP = '919060557296'

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const formatINR = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value)

  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const syncCart = () => {
      setCartItems(readCart())
    }

    syncCart()
    window.addEventListener(CART_UPDATED_EVENT, syncCart)
    window.addEventListener('storage', syncCart)

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setCartItems(readCart())
    }
  }, [open])

  const updateQuantity = (id: string, newQuantity: number) => {
    updateCartItemQuantity(id, newQuantity)
    setCartItems(readCart())
  }

  const removeItem = (id: string) => {
    removeFromCart(id)
    setCartItems(readCart())
  }

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  const submitToWhatsApp = () => {
    if (cartItems.length === 0) {
      return
    }

    const lines = cartItems.map((item, index) => {
      const amount = formatINR(item.price * item.quantity)
      return `${index + 1}. ${item.name} x ${item.quantity} - ${amount}`
    })

    const message = [
      'Hi Krishna Infotech Solutions,',
      'I am interested in the following items:',
      ...lines,
      '',
      `Total Amount: ${formatINR(total)}`,
      '',
      'Please contact me for negotiation and final deal.',
    ].join('\n')

    const url = `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-105 flex flex-col">
        <SheetHeader className="border-b border-border/80 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-lg">
              <ShoppingCart className="h-5 w-5 text-primary" />
              Shopping Cart
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto space-y-3 p-4">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl border border-border bg-card hover:border-primary/25 hover:bg-muted/30 transition-colors"
              >
                {/* Product Image */}
                <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary mt-1.5">
                    {formatINR(item.price * item.quantity)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatINR(item.price)} x {item.quantity}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-row items-center justify-end gap-2 self-start sm:flex-col sm:items-end sm:justify-between sm:gap-2 sm:self-auto">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-md hover:bg-muted"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-center gap-1 border border-border rounded-lg bg-background px-1 py-0.5 shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition rounded"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-semibold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 text-muted-foreground hover:text-foreground transition rounded"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center px-2">
              <ShoppingCart className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="font-semibold text-foreground mb-1">Your cart is empty</h3>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-xl"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <SheetFooter className="border-t border-border/80 pt-4 space-y-4">
            <div className="w-full rounded-xl border border-border bg-muted/30 p-3.5 text-sm">
              <div className="flex justify-between items-center font-semibold text-base">
                <span>Total Amount</span>
                <span className="text-primary">{formatINR(total)}</span>
              </div>
            </div>

            <Button
              onClick={submitToWhatsApp}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl"
              size="lg"
            >
              Submit on WhatsApp
            </Button>

            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full rounded-xl"
            >
              Continue Shopping
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
