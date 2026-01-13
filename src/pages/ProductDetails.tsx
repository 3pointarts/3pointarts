import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import useAdminProductStore from '../state/admin/AdminProductStore'
import { Status } from '../core/enum/Status'
import useCartStore from '../state/customer/CartStore'
import useWishlistStore from '../state/customer/WishlistStore'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { products, init, initStatus } = useAdminProductStore()
  const { addToCart } = useCartStore()
  const { wishlists, addToWishlist, removeFromWishlistByProduct } = useWishlistStore()
  const cstore = useCartStore()
  const [qty, setQty] = useState(1)
  const product = products.find((p) => p.id == Number(id))
  const wished = wishlists.some(w => w.productId === product?.id)



  const reviews = useMemo(() => {
    const list = [
      { id: 1, user: "Ravi Kumar", rating: 5, date: "10 Dec 2024", title: "Great product!", content: "Really loved the quality. Worth the price." },
      { id: 2, user: "Anita Singh", rating: 4, date: "15 Dec 2024", title: "Good, but delivery late", content: "Product is amazing but delivery took 2 days extra." },
      { id: 3, user: "John Doe", rating: 5, date: "20 Dec 2024", title: "Perfect fit", content: "Fits perfectly and looks exactly like the image." },
      { id: 4, user: "Priya M", rating: 3, date: "22 Dec 2024", title: "Average", content: "It's okay for the price, not the best quality." },
    ]
    return list.sort(() => Math.random() - 0.5)
  }, [])

  useEffect(() => {
    if (initStatus === Status.init) {
      init()
    }
  }, [init, initStatus])

  if (initStatus === Status.loading || initStatus === Status.init) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading Product...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page">
        <h2>Product Not Found</h2>
        <Link to="/catalog" className="btn-link">Back to Catalog</Link>
      </div>
    )
  }

  // Mock Data

  const inCart = cstore.carts.some(c => c.productId === product.id)
  const mrp = Math.floor(product.price * 1.4)
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const rating = 4.5
  const ratingCount = 1245
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })



  return (
    <div className="page product-details-page">
      <div className="breadcrumb">
        <Link to="/catalog">Catalog</Link> <span>›</span> <span className="active">{product.title}</span>
      </div>

      <div className="details-grid-amazon">
        {/* Left Column: Images */}
        <div className="col-images">
          <div className="main-image-container">
            <img src={product.images[0] || '/assets/images/full_logo.png'} alt={product.title} />
          </div>
        </div>

        {/* Center Column: Info */}
        <div className="col-info">
          <h1 className="product-title">{product.title}</h1>
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
            <div className="delivery">
              <span className="free">FREE delivery</span>
              <span className="date">{deliveryDate}</span>
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
              <li>{product.about}</li>
              <li>High quality material ensuring durability and comfort.</li>
              <li>Perfect for daily use or special occasions.</li>
              <li>Easy to clean and maintain.</li>
            </ul>
          </div>
          <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>Quantity:</label>
            <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ padding: '5px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRight: '1px solid #ddd' }}
              >
                -
              </button>
              <span style={{ padding: '5px 15px', minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{ padding: '5px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderLeft: '1px solid #ddd' }}
              >
                +
              </button>
            </div>
          </div>
          {product.stock <= 0 ? (
            <span className="out-of-stock">Out of stock</span>
          ) : (
            <div className='row'>
              {inCart ?
                (<Link to="/cart" className='col-md-6'><h5> Added to cart</h5></Link>) : (<button
                  className="btn-amazon-primary col-md-6"
                  onClick={async () => {
                    await addToCart(product.id, qty)
                  }}
                >
                  Add to Cart
                </button>)}
              <button className="btn-amazon-secondary col-md-6" onClick={async () => {
                if (!inCart) {
                  await addToCart(product.id, qty);
                }
                navigate('/cart')
              }}>Buy Now</button>
            </div>)}
          <div className="wishlist-row">
            <button
              className="btn-link-sm"
              onClick={async () => {
                if (product) {
                  if (wished) {
                    await removeFromWishlistByProduct(product.id)
                  } else {
                    await addToWishlist(product.id)
                  }
                }
              }}
            >
              {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
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
