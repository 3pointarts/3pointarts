import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import useCustomerOrderStore from '../state/customer/CustomerOrderStore'
import { Status } from '../core/enum/Status'

export default function BillView() {
  const { orderId } = useParams()
  const { orders, status, loadOrders } = useCustomerOrderStore()

  useEffect(() => {
    if (orders.length === 0 && status === Status.init) {
      loadOrders()
    }
  }, [orders.length, status, loadOrders])

  const order = orders.find((o) => o.id === Number(orderId))

  if (status === Status.loading) {
    return <div className="loading-bill">Loading invoice...</div>
  }

  if (!order) {
    return (
      <div className="bill-error">
        <p>Order not found.</p>
        <Link to="/orders" className="btn-secondary">Back to Orders</Link>
      </div>
    )
  }

  return (
    <div className="bill">
      <div className="bill-paper">
        <header className="bill-header-row">
          <div className="bill-brand">
            <div >
              <img height={50} src="/assets/images/logo.png" alt="3 Point Arts" />
              {/* <img height={50} src="/assets/images/name_logo.png" alt="3 Point Arts" /> */}
            </div>
            <div className="company-details">
              <strong>3 Point Arts </strong><br />
              86/1 Balkeshwar Colony, Kamla Nagar<br />
              Agra, India - 282005<br />
              3pointarts@gmail.com
            </div>
          </div>
          <div className="invoice-meta">
            <h1>INVOICE</h1>
            <table>
              <tbody>
                <tr><td>Invoice #:</td><td>{order.id}</td></tr>
                <tr><td>Date:</td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>
                <tr><td>Status:</td><td>PAID</td></tr>
              </tbody>
            </table>
          </div>
        </header>

        <section className="bill-addresses">
          <div className="bill-addr-box" style={{ textAlign: 'left' }}>
            <h3>Bill To:</h3>
            <p>
              <strong>{order.billTo}</strong><br />
              {order.contactAddress}<br />
              Phone: {order.contactPhone}<br />
              Contact: {order.contactName}
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
            {order.items?.map((item, idx) => {
              const price = item.product?.price || 0
              const total = price * item.qty
              return (
                <tr key={idx}>
                  <td>{item.product?.title || `Product #${item.productId}`}</td>
                  <td className="text-right">₹{price.toLocaleString()}</td>
                  <td className="text-center">{item.qty}</td>
                  <td className="text-right">₹{total.toLocaleString()}</td>
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
        <Link to="/orders" className="btn-back">Back to Orders</Link>
      </div>

      <style>{`
        .loading-bill {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            font-size: 1.2rem;
            color: #555;
        }
        .bill-error {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            gap: 1rem;
        }
        .bill-note {
            margin-top: 20px;
            padding: 10px;
            background: #f9f9f9;
            border-left: 4px solid #eee;
        }
        .print-actions {
            display: flex;
            gap: 1rem;
            margin-top: 20px;
        }
        .btn-print {
            padding: 10px 20px;
            background: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
        }
        .btn-back {
            padding: 10px 20px;
            background: white;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-decoration: none;
            display: inline-block;
            font-size: 1rem;
        }
        @media print {
            .print-actions {
                display: none;
            }
            .bill {
                background: white;
                padding: 0;
            }
            .bill-paper {
                box-shadow: none;
                margin: 0;
                width: 100%;
                min-height: auto;
                padding: 20px;
            }
        }
      `}</style>
    </div>
  )
}
