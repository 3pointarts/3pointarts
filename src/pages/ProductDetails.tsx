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

  // Mock Data
  const mrp = Math.floor(product.price * 1.4)
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const rating = 4.5
  const ratingCount = 1245
  const deliveryDate = "Friday, 12 Jan"

  const reviews = [
    { id: 1, user: "Ravi Kumar", rating: 5, date: "10 Dec 2024", title: "Great product!", content: "Really loved the quality. Worth the price." },
    { id: 2, user: "Anita Singh", rating: 4, date: "15 Dec 2024", title: "Good, but delivery late", content: "Product is amazing but delivery took 2 days extra." },
    { id: 3, user: "John Doe", rating: 5, date: "20 Dec 2024", title: "Perfect fit", content: "Fits perfectly and looks exactly like the image." },
    { id: 4, user: "Priya M", rating: 3, date: "22 Dec 2024", title: "Average", content: "It's okay for the price, not the best quality." },
  ]

  return (
    <div className="page product-details-page">
      <div className="breadcrumb">
        <Link to="/catalog">Catalog</Link> <span>›</span> <span className="active">{product.name}</span>
      </div>

      <div className="details-grid-amazon">
        {/* Left Column: Images */}
        <div className="col-images">
          <div className="main-image-container">
            <img src={product.imageUrl || '/assets/images/full_logo.png'} alt={product.name} />
          </div>
        </div>

        {/* Center Column: Info */}
        <div className="col-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-meta">
            <div className="rating-row">
              <span className="stars">★★★★☆</span>
              <span className="arrow-down"></span>
              <Link to="#reviews" className="rating-count">{ratingCount.toLocaleString()} ratings</Link>
            </div>
          </div>

          <div className="divider"></div>

          <div className="price-section">
            <div className="price-row-lg">
              <span className="discount-lg">-{discount}%</span>
              <span className="currency-lg">₹</span>
              <span className="price-lg">{product.price.toLocaleString()}</span>
            </div>
            <div className="mrp-row">
              M.R.P.: <span className="strike">₹{mrp.toLocaleString()}</span>
            </div>
            <div className="taxes-note">Inclusive of all taxes</div>
          </div>

          <div className="divider"></div>



          <div className="divider"></div>

          <div className="about-item">
            <h3>About this item</h3>
            <ul>
              <li>{product.description}</li>
              <li>High quality material ensuring durability and comfort.</li>
              <li>Perfect for daily use or special occasions.</li>
              <li>Easy to clean and maintain.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Buy Box */}
        <div className="col-buybox">
          <div className="buybox-inner">
            <div className="price-lg">₹{product.price.toLocaleString()}</div>
            <div className="delivery-info">
              <Link to="#">FREE delivery</Link>
              <br />
            </div>
            <div className="stock-status">In stock</div>
            <div className="sold-by">
              Sold by <Link to="#">3 Point Arts</Link>
            </div>

            <div className="qty-row">
              <label>Quantity:</label>
              <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <button
              className="btn-amazon-primary"
              onClick={() => {
                for (let i = 0; i < qty; i++) {
                  dispatch({ type: 'CART_ADD', productId: product.id })
                }
              }}
            >
              Add to Cart
            </button>
            <button className="btn-amazon-secondary">Buy Now</button>

            <div className="secure-trans">
              <span className="lock-icon">🔒</span> Secure transaction
            </div>

            <div className="wishlist-row">
              <button
                className="btn-link-sm"
                onClick={() =>
                  dispatch({
                    type: wished ? 'WISHLIST_REMOVE' : 'WISHLIST_ADD',
                    productId: product.id,
                  })
                }
              >
                {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="divider-section"></div>

      {/* Reviews Section */}
      <div className="reviews-container" id="reviews">
        <div className="reviews-left">
          <h2>Customer reviews</h2>
          <div className="rating-summary">
            <div className="stars-lg">★★★★☆</div>
            <span>{rating} out of 5</span>
          </div>
          <div className="global-ratings">{ratingCount.toLocaleString()} global ratings</div>

          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div className="bar-row" key={star}>
                <span>{star} star</span>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${[60, 20, 10, 5, 5][i]}%` }}></div></div>
                <span>{[60, 20, 10, 5, 5][i]}%</span>
              </div>
            ))}
          </div>

          <div className="review-cta">
            <h3>Review this product</h3>
            <p>Share your thoughts with other customers</p>
            <button className="btn-write-review">Write a product review</button>
          </div>
        </div>

        <div className="reviews-right">
          <h3>Top reviews from India</h3>
          {reviews.map(review => (
            <div className="review-card" key={review.id}>
              <div className='d-flex justify-content-between'>

                <div className="review-user">
                  <div className="user-avatar"></div>
                  <span>{review.user}<div className="verified-badge">Verified Purchase</div></span>
                </div>
                <div className="review-date">Reviewed in India on {review.date}</div>
              </div>
              <div className="review-rating-row">
                <span className="stars">{Array(review.rating).fill('★').join('')}{Array(5 - review.rating).fill('☆').join('')}</span>
                <span className="review-title">{review.title}</span>
              </div>


              <div className="review-content">{review.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
