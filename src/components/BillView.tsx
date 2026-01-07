import { useParams } from 'react-router-dom'
import { useStore } from '../state/Store'

export default function BillView() {
  const { orderId } = useParams()
  const { state, selectors } = useStore()
  const order = state.orders.find((o) => o.id === orderId)
  if (!order) return <div>Order not found.</div>

  function productName(id: string) {
    return selectors.productById(id)?.name || id
  }

  return (
    <div className="bill">
      <div className="bill-header">
        <img src="/assets/images/name_logo.png" alt="3 Point Arts" height={40} />
        <h2>Invoice</h2>
        <span>Order {order.id}</span>
        <span>Date {new Date(order.createdAt).toLocaleString()}</span>
      </div>
      <div className="bill-body">
        <h3>Items</h3>
        {order.items.map((i) => (
          <div className="bill-row" key={i.productId}>
            <span>{productName(i.productId)}</span>
            <span>x{i.qty}</span>
          </div>
        ))}
        <h3>Ship To</h3>
        <div className="address">
          <div>{order.shippingAddress.fullName}</div>
          <div>{order.shippingAddress.line1}</div>
          {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
          <div>
            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
            {order.shippingAddress.postalCode}
          </div>
          <div>{order.shippingAddress.country}</div>
          <div>Contact: {order.shippingAddress.contactNumber}</div>
        </div>
      </div>
      <div className="bill-total">Total: ₹{order.total}</div>
      <button onClick={() => window.print()}>Print / Save PDF</button>
    </div>
  )
}
