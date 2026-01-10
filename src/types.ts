export type Category = 'Lamp' | 'Statue' | 'Cars' | 'Lego Toys'

export type Product = {
  id: string
  name: string
  description: string
  price: number
  category: Category
  imageUrl?: string
}

export type CartItem = {
  productId: string
  qty: number
}

export type Address = {
  fullName: string
  line1: string
  line2?: string
  city: string
  state: string
  postalCode: string
  country: string
  contactNumber: string
}

export type Order = {
  id: string
  items: CartItem[]
  total: number
  createdAt: string
  shippingAddress: Address
  status: 'ordered' | 'packed' | 'shipped' | 'delivered'
}

export type UserProfile = {
  email: string
  name: string
  phoneNumber?: string
}
