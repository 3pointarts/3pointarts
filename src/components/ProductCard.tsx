import { Link, useNavigate } from 'react-router-dom'
import { ProductModel } from '../data/model/ProductModel'
import useCartStore from '../state/customer/CartStore'
import useWishlistStore from '../state/customer/WishlistStore'

export default function ProductCard({ product }: { product: ProductModel }) {
  const { addToCart } = useCartStore()
  const { wishlists, addToWishlist, removeFromWishlistByProduct } = useWishlistStore()
  const cstore = useCartStore()
  const navigate = useNavigate()
  const wished = wishlists.some(w => w.productId === product.id)

  // Mock data to match the design since they are missing in the Product type
  const mrp = Math.floor(product.price * 1.4) // 40% markup for demo
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const inCart = cstore.carts.some(c => c.productId === product.id)
  const reviewCount = 18
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })

  const toggleWishlist = async () => {
    if (wished) {
      await removeFromWishlistByProduct(product.id)
    } else {
      await addToWishlist(product.id)
    }
  }

  return (
    <div className="product-card">
      <div className="image-wrap">
        <Link to={`/product/${product.id}`} className="img-link">
          <img
            src={product.images[0] || '/assets/images/full_logo.png'}
            alt={product.title}
          />
        </Link>
        <button
          aria-label="Toggle wishlist"
          className={`heart ${wished ? 'active' : ''}`}
          onClick={toggleWishlist}
        >
          <i className={`fa ${wished ? 'fa-heart' : 'fa-heart-o'}`} style={{ fontSize: '24px' }}></i>
        </button>
      </div>

      <div className="info">
        <h3>
          <Link to={`/product/${product.id}`}>
            {product.title}
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



        <div className="actions">
          {product.stock <= 0 ? (
            <span className="out-of-stock">Out of stock</span>
          ) : (
            inCart ?
              (<Link to="/cart"><h3> Added to cart</h3></Link>) : (
                <button
                  className="btn-cart"
                  onClick={() => {
                    addToCart(product.id, 1)
                    navigate('/cart')
                  }}
                >
                  Add to cart
                </button>
              )
          )}
        </div>
      </div>
    </div >
  )
}
