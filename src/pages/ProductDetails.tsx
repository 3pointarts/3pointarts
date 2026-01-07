import { useParams, Link } from 'react-router-dom'
import { useStore } from '../state/Store'
import { useState } from 'react'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const { state, dispatch } = useStore()
  const [qty, setQty] = useState(1)

  const product = state.products.find((p) => p.id === id)
  const wished = product ? state.wishlist.includes(product.id) : false

  if (!product) {
    return (
      <div className="page">
        <h2>Product Not Found</h2>
        <Link to="/catalog" className="btn-link">Back to Catalog</Link>
      </div>
    )
  }

  return (
    <div className="page product-details-page">
      <div className="breadcrumb">
        <Link to="/catalog">Catalog</Link> / <span>{product.name}</span>
      </div>

      <div className="details-grid">
        <div className="details-image">
          <img src={product.imageUrl || '/assets/images/full_logo.png'} alt={product.name} />
          <button
            aria-label="Toggle wishlist"
            className={`heart-lg ${wished ? 'active' : ''}`}
            onClick={() =>
              dispatch({
                type: wished ? 'WISHLIST_REMOVE' : 'WISHLIST_ADD',
                productId: product.id,
              })
            }
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-6.716-4.335-9.243-6.862C1.178 12.559 1 10.402 2.343 8.879c1.343-1.522 3.5-1.7 4.964-.236L12 10.336l4.693-1.693c1.465-1.464 3.622-1.286 4.964.236 1.343 1.523 1.165 3.68-.414 5.259C18.716 16.665 12 21 12 21z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="category-badge">{product.category}</p>
          <p className="price-lg">₹{product.price}</p>
          
          <p className="desc-lg">{product.description}</p>
          
          <div className="actions-lg">
            <div className="qty-selector">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
              <span>{qty}</span>
              <button onClick={() => setQty(qty + 1)}>+</button>
            </div>
            
            <button
              className="btn-add-cart-lg"
              onClick={() => {
                for(let i=0; i<qty; i++) {
                   dispatch({ type: 'CART_ADD', productId: product.id })
                }
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
