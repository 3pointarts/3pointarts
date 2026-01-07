import { useStore } from '../state/Store'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { state, dispatch, selectors } = useStore()

  function name(id: string) {
    return selectors.productById(id)?.name || id
  }
  function price(id: string) {
    return selectors.productById(id)?.price || 0
  }

  const total = selectors.cartTotal()

  return (
    <section>
      <h2>Cart</h2>
      <div className="cart-list">
        {state.cart.map((item) => (
          <div className="cart-row" key={item.productId}>
            <span>{name(item.productId)}</span>
            <span>₹{price(item.productId)}</span>
            <input
              type="number"
              min={1}
              value={item.qty}
              onChange={(e) =>
                dispatch({
                  type: 'CART_SET_QTY',
                  productId: item.productId,
                  qty: parseInt(e.target.value || '1', 10),
                })
              }
            />
            <button onClick={() => dispatch({ type: 'CART_REMOVE', productId: item.productId })}>Remove</button>
          </div>
        ))}
        {state.cart.length === 0 && <div>Your cart is empty.</div>}
      </div>
      <div className="cart-total">Total: ₹{total}</div>
      <Link className="cta" to="/checkout">Proceed to Checkout</Link>
    </section>
  )
}
