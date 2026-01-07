import { createContext, useContext, useMemo, useReducer, useEffect } from 'react'
import type { Product, CartItem, Order, UserProfile, Address } from '../types'
import { products as seedProducts } from '../data/products'

type State = {
  products: Product[]
  wishlist: string[]
  cart: CartItem[]
  orders: Order[]
  user: UserProfile | null
  otpByEmail: Record<string, string | undefined>
}

type Action =
  | { type: 'HYDRATE'; payload: Partial<State> }
  | { type: 'LOGIN'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'REQUEST_OTP'; email: string; otp: string }
  | { type: 'CLEAR_OTP'; email: string }
  | { type: 'WISHLIST_ADD'; productId: string }
  | { type: 'WISHLIST_REMOVE'; productId: string }
  | { type: 'CART_ADD'; productId: string }
  | { type: 'CART_REMOVE'; productId: string }
  | { type: 'CART_SET_QTY'; productId: string; qty: number }
  | { type: 'PLACE_ORDER'; order: Order }

const initial: State = {
  products: seedProducts,
  wishlist: [],
  cart: [],
  orders: [],
  user: null,
  otpByEmail: {},
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, ...action.payload, products: state.products }
    case 'LOGIN':
      return { ...state, user: action.payload }
    case 'LOGOUT':
      return { ...state, user: null }
    case 'REQUEST_OTP':
      return {
        ...state,
        otpByEmail: { ...state.otpByEmail, [action.email]: action.otp },
      }
    case 'CLEAR_OTP':
      return {
        ...state,
        otpByEmail: { ...state.otpByEmail, [action.email]: undefined },
      }
    case 'WISHLIST_ADD':
      return state.wishlist.includes(action.productId)
        ? state
        : { ...state, wishlist: [...state.wishlist, action.productId] }
    case 'WISHLIST_REMOVE':
      return {
        ...state,
        wishlist: state.wishlist.filter((id) => id !== action.productId),
      }
    case 'CART_ADD': {
      const exists = state.cart.find((c) => c.productId === action.productId)
      const cart = exists
        ? state.cart.map((c) =>
          c.productId === action.productId ? { ...c, qty: c.qty + 1 } : c
        )
        : [...state.cart, { productId: action.productId, qty: 1 }]
      return { ...state, cart }
    }
    case 'CART_REMOVE':
      return {
        ...state,
        cart: state.cart.filter((c) => c.productId !== action.productId),
      }
    case 'CART_SET_QTY':
      return {
        ...state,
        cart: state.cart
          .map((c) =>
            c.productId === action.productId ? { ...c, qty: action.qty } : c
          )
          .filter((c) => c.qty > 0),
      }
    case 'PLACE_ORDER':
      return { ...state, orders: [action.order, ...state.orders], cart: [] }
    default:
      return state
  }
}

type StoreContext = {
  state: State
  dispatch: React.Dispatch<Action>
  selectors: {
    productById: (id: string) => Product | undefined
    cartTotal: () => number
  }
  actions: {
    requestOtp: (email: string) => string
    verifyOtp: (email: string, input: string, name?: string) => boolean
    placeOrder: (address: Address) => Order
  }
}

const Ctx = createContext<StoreContext | null>(null)

const STORAGE_KEY = 'threepointarts_store_v1'

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch (_e) { void 0 }
  }, [])

  useEffect(() => {
    const { otpByEmail: _otp, ...persist } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persist))
  }, [state])

  const selectors = useMemo(
    () => ({
      productById: (id: string) => state.products.find((p) => p.id === id),
      cartTotal: () =>
        state.cart.reduce((sum, item) => {
          const p = state.products.find((x) => x.id === item.productId)
          return sum + (p ? p.price * item.qty : 0)
        }, 0),
    }),
    [state.products, state.cart]
  )

  function genOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const actions = useMemo(
    () => ({
      requestOtp: (email: string) => {
        const otp = genOtp()
        dispatch({ type: 'REQUEST_OTP', email, otp })
        return otp
      },
      verifyOtp: (email: string, input: string, name?: string, phoneNumber?: string) => {
        const otp = state.otpByEmail[email]
        const ok = !!otp && otp === input
        if (ok) {
          dispatch({ type: 'CLEAR_OTP', email })
          const existingRaw = localStorage.getItem('users')
          const users: Record<string, UserProfile> = existingRaw
            ? JSON.parse(existingRaw)
            : {}
          const existing = users[email]
          const profile: UserProfile = {
            email,
            name: name || existing?.name || 'User',
            phoneNumber: phoneNumber || existing?.phoneNumber
          }
          users[email] = profile
          localStorage.setItem('users', JSON.stringify(users))
          dispatch({ type: 'LOGIN', payload: profile })
        }
        return ok
      },
      placeOrder: (address: Address) => {
        const total = selectors.cartTotal()
        const order: Order = {
          id: 'ORD-' + Date.now(),
          items: state.cart,
          total,
          createdAt: new Date().toISOString(),
          shippingAddress: address,
        }
        dispatch({ type: 'PLACE_ORDER', order })
        return order
      },
    }),
    [state.cart, state.otpByEmail, selectors]
  )

  const value: StoreContext = { state, dispatch, selectors, actions }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store not initialized')
  return ctx
}
