import { Link } from 'react-router-dom'
import { useStore } from '../state/Store'

export default function Orders() {
  const { state } = useStore()
  return (
    <section>
      <h2>Your Orders</h2>
      <div className="orders-list">
        {state.orders.map((o) => (
          <div className="order-row" key={o.id}>
            <div>
              <strong>{o.id}</strong> — {new Date(o.createdAt).toLocaleString()}
            </div>
            <div>Total: ₹{o.total}</div>
            <Link to={`/orders/${o.id}`}>View Bill</Link>
          </div>
        ))}
        {state.orders.length === 0 && <div>No orders yet.</div>}
      </div>
    </section>
  )
}
