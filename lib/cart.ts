export type CartItem = {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

const CART_STORAGE_KEY = 'krishna_cart'
export const CART_UPDATED_EVENT = 'cart:updated'

function isBrowser() {
  return typeof window !== 'undefined'
}

function sanitizeCartItem(item: Partial<CartItem>): CartItem | null {
  if (
    typeof item.id !== 'string' ||
    typeof item.name !== 'string' ||
    typeof item.price !== 'number' ||
    !Number.isFinite(item.price) ||
    typeof item.quantity !== 'number' ||
    !Number.isFinite(item.quantity) ||
    item.quantity <= 0 ||
    typeof item.image !== 'string'
  ) {
    return null
  }

  return {
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: Math.max(1, Math.floor(item.quantity)),
    image: item.image,
  }
}

function notifyCartUpdated() {
  if (!isBrowser()) {
    return
  }

  window.dispatchEvent(new Event(CART_UPDATED_EVENT))
}

export function readCart(): CartItem[] {
  if (!isBrowser()) {
    return []
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw) as Partial<CartItem>[]
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => sanitizeCartItem(item))
      .filter((item): item is CartItem => item !== null)
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  if (!isBrowser()) {
    return
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  notifyCartUpdated()
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  const items = readCart()
  const existing = items.find((entry) => entry.id === item.id)

  if (existing) {
    existing.quantity += Math.max(1, Math.floor(quantity))
    writeCart(items)
    return
  }

  items.push({
    ...item,
    quantity: Math.max(1, Math.floor(quantity)),
  })

  writeCart(items)
}

export function removeFromCart(id: string) {
  const items = readCart().filter((item) => item.id !== id)
  writeCart(items)
}

export function updateCartItemQuantity(id: string, quantity: number) {
  if (quantity <= 0) {
    removeFromCart(id)
    return
  }

  const items = readCart().map((item) =>
    item.id === id
      ? { ...item, quantity: Math.max(1, Math.floor(quantity)) }
      : item
  )

  writeCart(items)
}

export function getCartItemCount() {
  return readCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartTotal() {
  return readCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}
