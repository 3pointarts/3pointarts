import { Link, Navigate } from 'react-router-dom'
import { useStore } from '../state/Store'
import useCustomerAuthStore from '../state/customer/CustomerAuthStore'

export default function Dashboard() {
  const store = useCustomerAuthStore()
  // const { state, dispatch } = useStore()

  if (!store.customer) {
    return <Navigate to="/login" replace />
  }

  // const cartCount = state.cart.reduce((s, c) => s + c.qty, 0)
  // const wishlistCount = state.wishlist.length
  // const ordersCount = state.orders.length
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Your Account</h2>
      </div>

      <div className="dashboard-layout">
        {/* Left Column: Profile */}
        <div className="dashboard-profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {store.customer?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3>{store.customer?.name || 'User'}</h3>
            <p className="profile-email">{store.customer?.email || 'No email'}</p>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="label">Phone:</span>
              <span className="value">{store.customer?.phone || 'Not provided'}</span>
            </div>
            <div className="detail-row">
              <span className="label">Member Since:</span>
              <span className="value">{store.customer?.createdAt?.toISOString().split('T')[0] || 'N/A'}</span>
            </div>
          </div>

          <button
            className="btn-logout"
            onClick={() => store.logout()}
          >
            Sign Out
          </button>
        </div>

        {/* Right Column: Action Cards */}
        <div className="dashboard-actions">

          <Link to="/cart" className="action-card">
            <div className="icon-box cart-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3>Your Cart</h3>
              <p>{0} items in your cart</p>
            </div>
            <div className="arrow-icon">→</div>
          </Link>

          <Link to="/wishlist" className="action-card">
            <div className="icon-box wishlist-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <div className="card-content">
              <h3>Your Wishlist</h3>
              <p>{0} items saved for later</p>
            </div>
            <div className="arrow-icon">→</div>
          </Link>

          <Link to="/orders" className="action-card">
            <div className="icon-box orders-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </div>
            <div className="card-content">
              <h3>Your Orders</h3>
              <p>{0} orders placed</p>
            </div>
            <div className="arrow-icon">→</div>
          </Link>

        </div>
      </div>
    </div>
  )
}
