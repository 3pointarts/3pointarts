import { Link } from 'react-router-dom'
import { useStore } from '../state/Store'
import type { Order } from '../types'

const sampleOrder: Order = {
  id: 'SAMPLE-ORD-001',
  items: [
    { productId: 'lamp-aurora', qty: 1 },
    { productId: 'statue-dragon', qty: 1 }
  ],
  total: 3498,
  createdAt: new Date().toISOString(),
  shippingAddress: {
    fullName: 'Rahul Sharma',
    line1: '123, Green Park',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110016',
    country: 'India',
    contactNumber: '9876543210'
  },
  status: 'delivered'
}

export default function Orders() {
  const { state, selectors } = useStore()
  // Use state orders if exist, else show sample if empty (for demo)
  const orders = state.orders.length > 0 ? state.orders : [sampleOrder]

  const steps = ['ordered', 'packed', 'shipped', 'delivered']

  function getStepIndex(status: string) {
    return steps.indexOf(status)
  }

  function getProductName(id: string) {
    return selectors.productById(id)?.name || id
  }

  return (
    <section className="orders">
      <h2 className="page-title">Your Orders</h2>
      <div className="orders-container">
        {orders.map((order) => {
          const currentStep = getStepIndex(order.status)
          return (
            <div className="order-card" key={order.id}>
              <div className="order-header">
                <div className="header-col">
                  <span className="order-label">ORDER PLACED</span>
                  <span className="order-value">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="header-col">
                  <span className="order-label">TOTAL</span>
                  <span className="order-value">₹{order.total.toLocaleString()}</span>
                </div>
                <div className="header-col">
                  <span className="order-label">SHIP TO</span>
                  <span className="order-value order-link">{order.shippingAddress.fullName}</span>
                </div>
                <div className="header-col right">
                  <span className="order-label">ORDER # {order.id}</span>
                  <div className="order-actions">
                    <Link to={`/orders/${order.id}`} className="link-blue">View Invoice</Link>
                  </div>
                </div>
              </div>

              <div className="order-body">
                <div className="order-status-row">
                  <h3 className={`status-text ${order.status}`}>{order.status === 'delivered' ? 'Delivered' : 'Arriving soon'}</h3>
                </div>
                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="item-row">
                      <div className="item-info">
                        <span className="item-name">{getProductName(item.productId)}</span>
                        <span className="item-qty">Qty: {item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="track-container">
                  <div className="track-steps">
                    {steps.map((step, index) => {
                      const isActive = index <= currentStep
                      return (
                        <div key={step} className={`track-step ${isActive ? 'active' : ''}`}>
                          <div className="step-circle"></div>
                          <div className="step-label">{step.charAt(0).toUpperCase() + step.slice(1)}</div>
                          {index < steps.length - 1 && (
                            <div className={`step-line ${index < currentStep ? 'active' : ''}`}></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
