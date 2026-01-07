import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../state/Store'

export default function Dashboard() {
  const { state } = useStore()

  if (!state.user) {
    return <Navigate to="/login" replace />
  }

  return (
    <section>
      <h2>User Dashboard</h2>
      <div className="profile">
        <h3>Profile</h3>
        <div>Name: {state.user.name}</div>
        <div>Email: {state.user.email}</div>
        {state.user.phoneNumber && <div>Phone: {state.user.phoneNumber}</div>}
        <div className="dash-links">
          <Link to="/wishlist">Wishlist ({state.wishlist.length})</Link>
          <Link to="/cart">Cart ({state.cart.reduce((s, c) => s + c.qty, 0)})</Link>
          <Link to="/orders">Orders ({state.orders.length})</Link>
        </div>
      </div>
    </section>
  )
}
