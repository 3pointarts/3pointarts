import { Link } from 'react-router-dom'
import useCustomerOrderStore from '../state/customer/CustomerOrderStore'
import { useEffect } from 'react'
import { Status } from '../core/enum/Status'
import { OrderStatus } from '../core/enum/OrderStatus'

export default function Orders() {
  const { orders, status, loadOrders } = useCustomerOrderStore()

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const steps = ['ordered', 'packed', 'shipped', 'delivered']

  function getStepIndex(status: string) {
    switch (status) {
      case OrderStatus.new: return 0;
      case OrderStatus.building: return 1;
      case OrderStatus.shipped: return 2;
      case OrderStatus.delivered: return 3;
      default: return 0;
    }
  }

  function getProductName(item: any) {
    return item.productVariant?.product?.title + ' - ' + item.productVariant?.color || `Product Variant #${item.productVariantId}`
  }

  if (status === Status.loading) {
    return (
      <section className="orders">
        <h2 className="page-title">Your Orders</h2>
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your orders...</p>
        </div>
        <style>{`
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem;
                }
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #ffd814;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin-bottom: 1rem;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
      </section>
    )
  }

  if (status === Status.error) {
    return (
      <section className="orders">
        <h2 className="page-title">Your Orders</h2>
        <div className="error-message">
          <p>Failed to load orders. Please try again later.</p>
          <button className="btn-secondary" onClick={() => loadOrders()}>Retry</button>
        </div>
        <style>{`
                .error-message {
                    text-align: center;
                    padding: 4rem;
                    color: #d32f2f;
                }
                .btn-secondary {
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    background: white;
                    cursor: pointer;
                }
            `}</style>
      </section>
    )
  }

  return (
    <section className="orders">
      <h2 className="page-title">Your Orders</h2>
      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <Link to="/" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          orders.map((order) => {
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
                    <span className="order-value order-link">{order.contactName}</span>
                  </div>
                  <div className="header-col right">
                    <span className="order-label">ORDER # {order.id}</span>
                    <div className="order-actions">
                      <Link to={`/order/${order.id}`} className="btn-primary">View Invoice</Link>
                    </div>
                  </div>
                </div>

                <div className="order-body">
                  <div className="order-status-row">
                    <h3 className={`status-text ${order.status}`}>
                      {order.status === OrderStatus.delivered ? 'Delivered' :
                        order.status === OrderStatus.shipped ? 'Shipped' :
                          order.status === OrderStatus.building ? 'Packing' : 'Ordered'}
                    </h3>
                  </div>
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="item-row">
                        <div className="item-info">
                          <span className="item-name">{getProductName(item)}</span>
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
          })
        )}
      </div>
      <style>{`
        .empty-orders {
            text-align: center;
            padding: 4rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        .empty-orders p {
            margin-bottom: 1.5rem;
            color: #555;
            font-size: 1.1rem;
        }
        .btn-primary {
            background: #ffd814;
            border: 1px solid #fcd200;
            padding: 0.75rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
            text-decoration: none;
            color: #111;
        }
      `}</style>
    </section>
  )
}
