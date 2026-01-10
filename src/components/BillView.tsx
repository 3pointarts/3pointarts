import { useParams } from 'react-router-dom'
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

export default function BillView() {
  const { orderId } = useParams()
  const { state, selectors } = useStore()

  // Try to find in state, fallback to sample if ID matches
  const order = state.orders.find((o) => o.id === orderId) || (orderId === sampleOrder.id ? sampleOrder : undefined)

  if (!order) return <div>Order not found.</div>

  function productName(id: string) {
    const p = selectors.productById(id)
    return p ? p.name : id
  }

  function productPrice(id: string) {
    const p = selectors.productById(id)
    return p ? p.price : 0
  }

  return (
    <div className="bill">
      <div className="bill-paper">
        <header className="bill-header-row">
          <div className="bill-brand">
            <div >

              <img height={50} src="/assets/images/logo.png" alt="3 Point Arts" />
              <img height={50} src="/assets/images/name_logo.png" alt="3 Point Arts" />

            </div>
            <div className="company-details">
              <strong>3 Point Arts </strong><br />
              123 Creative Avenue, Art District<br />
              New Delhi, India - 110001<br />
              support@3pointarts.com
            </div>
          </div>
          <div className="invoice-meta">
            <h1>INVOICE</h1>
            <table>
              <tbody>
                <tr><td>Invoice #:</td><td>{order.id}</td></tr>
                <tr><td>Date:</td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>
                <tr><td>Status:</td><td>{order.status.toUpperCase()}</td></tr>
              </tbody>
            </table>
          </div>
        </header>

        <section className="bill-addresses">
          <div className="bill-addr-box">
            <h3>Bill To:</h3>
            <p>
              <strong>{order.shippingAddress.fullName}</strong><br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.contactNumber}
            </p>
          </div>
        </section>

        <table className="bill-table">
          <thead>
            <tr>
              <th>Item Description</th>
              <th className="text-right">Price</th>
              <th className="text-center">Qty</th>
              <th className="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => {
              const price = productPrice(item.productId)
              return (
                <tr key={idx}>
                  <td>{productName(item.productId)}</td>
                  <td className="text-right">₹{price.toLocaleString()}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">₹{(price * item.qty).toLocaleString()}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right"><strong>Subtotal</strong></td>
              <td className="text-right">₹{order.total.toLocaleString()}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right"><strong>Shipping</strong></td>
              <td className="text-right">Free</td>
            </tr>
            <tr className="grand-total">
              <td colSpan={3} className="text-right"><strong>Total</strong></td>
              <td className="text-right">₹{order.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <footer className="bill-footer">
          <p>Thank you for your business!</p>
          <p className="small">This is a computer-generated invoice and does not require a signature.</p>
        </footer>
      </div>

      <div className="print-actions">
        <button onClick={() => window.print()} className="btn-print">Print / Save PDF</button>
      </div>
    </div>
  )
}
