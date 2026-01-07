import { useStore } from '../state/Store'
import type { Product } from '../types'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useStore()
  const wished = state.wishlist.includes(product.id)

  return (
    <div className="product-card">
      <div className="image-wrap">
        <Link to={`/product/${product.id}`} style={{ display: 'block', height: '100%' }}>
          <img
            src={product.imageUrl || '/assets/images/full_logo.png'}
            alt={product.name}
          />
        </Link>
        <button
          aria-label="Toggle wishlist"
          className={`heart ${wished ? 'active' : ''}`}
          onClick={() =>
            dispatch({
              type: wished ? 'WISHLIST_REMOVE' : 'WISHLIST_ADD',
              productId: product.id,
            })
          }
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21s-6.716-4.335-9.243-6.862C1.178 12.559 1 10.402 2.343 8.879c1.343-1.522 3.5-1.7 4.964-.236L12 10.336l4.693-1.693c1.465-1.464 3.622-1.286 4.964.236 1.343 1.523 1.165 3.68-.414 5.259C18.716 16.665 12 21 12 21z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
      <div className="info">
        <h3>
          <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {product.name}
          </Link>
        </h3>
        <p className="desc">{product.description}</p>
        <p className="price">₹{product.price}</p>
      </div>
      <div className="actions">
        <button
          className="btn-cart"
          onClick={() => dispatch({ type: 'CART_ADD', productId: product.id })}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M7 4h-2l-1 2v2h2l3 9h8l3-9H7z" stroke="#111" fill="#111" />
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}
