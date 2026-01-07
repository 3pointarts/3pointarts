import { useState } from 'react'
import { useStore } from '../state/Store'
import type { Address } from '../types'

export default function CheckoutModal() {
  const { state, actions } = useStore()
  const [address, setAddress] = useState<Address>({
    fullName: state.user?.name || '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    contactNumber: '',
  })
  const [line2, setLine2] = useState('')
  const [placedId, setPlacedId] = useState<string | null>(null)

  function place() {
    const order = actions.placeOrder({ ...address, line2 })
    setPlacedId(order.id)
  }

  if (!state.user) return <div className="notice">Login required to place order.</div>
  if (state.cart.length === 0) return <div className="notice">Your cart is empty.</div>

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Shipping Address & Contact</h3>
        <div className="grid">
          <label>
            Full Name
            <input
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            />
          </label>
          <label>
            Contact Number
            <input
              value={address.contactNumber}
              onChange={(e) => setAddress({ ...address, contactNumber: e.target.value })}
              placeholder="10-digit"
            />
          </label>
          <label>
            Address Line 1
            <input
              value={address.line1}
              onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            />
          </label>
          <label>
            Address Line 2
            <input value={line2} onChange={(e) => setLine2(e.target.value)} />
          </label>
          <label>
            City
            <input
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </label>
          <label>
            State
            <input
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
            />
          </label>
          <label>
            Postal Code
            <input
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
            />
          </label>
          <label>
            Country
            <input
              value={address.country}
              onChange={(e) => setAddress({ ...address, country: e.target.value })}
            />
          </label>
        </div>
        <button onClick={place}>Place Order</button>
        {placedId && <div className="success">Order placed: {placedId}</div>}
      </div>
    </div>
  )
}
