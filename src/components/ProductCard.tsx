import { useStore } from '../state/Store'
import type { Product } from '../types'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }: { product: Product }) {
  const { state, dispatch } = useStore()
  const wished = state.wishlist.includes(product.id)

  // Mock data to match the design since they are missing in the Product type
  const mrp = Math.floor(product.price * 1.4) // 40% markup for demo
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const rating = 5.0
  const reviewCount = 18
  const deliveryDate = "Sat, 10 Jan"

  return (
    <div className="product-card">
      <div className="image-wrap">
        <Link to={`/product/${product.id}`} className="img-link">
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      </div>

      <div className="info">
        <h3>
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="count">{reviewCount}</span>
        </div>

        <div className="price-block">
          <div className="price-row">
            <span className="currency">₹</span>
            <span className="price-main">{product.price.toLocaleString()}</span>
            <span className="mrp">M.R.P: <span>₹{mrp.toLocaleString()}</span></span>
            <span className="discount">({discount}% off)</span>
          </div>
          <div className="coupon">
            <span className="badge">Save 2%</span> with coupon
          </div>
        </div>

        <div className="delivery">
          <span className="free">FREE delivery</span>
          <span className="date">{deliveryDate}</span>
        </div>

        <div className="prime-delivery">
          Or <span className="prime">Prime</span> members get FREE delivery
        </div>

        <div className="actions">
          <button
            className="btn-cart"
            onClick={() => dispatch({ type: 'CART_ADD', productId: product.id })}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
