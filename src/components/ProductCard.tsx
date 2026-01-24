import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ProductModel } from '../data/model/ProductModel'
import useCartStore from '../state/customer/CartStore'
import useWishlistStore from '../state/customer/WishlistStore'
import type { ProductVariantModel } from '../data/model/ProductVariantModel'
import ShareDialog from './ShareDialog'

export default function ProductCard({ product, variantId, variantOptional }: { product: ProductModel, variantId?: number, variantOptional?: ProductVariantModel }) {
  const { addToCart } = useCartStore()
  const { wishlists, addToWishlist, removeFromWishlistByProduct } = useWishlistStore()
  const cstore = useCartStore()
  const navigate = useNavigate()
  const [showShare, setShowShare] = useState(false)

  // Find the specific variant or default to the first one
  const variant = product.productVariants.length > 0 ? (variantId
    ? product.productVariants?.find(v => v.id === variantId)
    : product.productVariants?.[0]) : variantOptional;

  // Fallback if no variant found (shouldn't happen with valid data)
  const displayVariant = variant || product.productVariants?.[0]

  // If still no variant (product has 0 variants), we might need a fallback or return null
  if (!displayVariant) return null;

  const price = displayVariant.price;
  const mrp = Math.floor(price * 1.4) // 40% markup for demo
  const discount = Math.round(((mrp - price) / mrp) * 100)

  // Check if THIS specific variant is in cart
  const inCart = cstore.carts.some(c => c.productVariantId === displayVariant.id)

  const wished = wishlists.some(w => w.productVariantId === displayVariant.id)

  const reviewCount = 18
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })

  // Stock for this variant
  const stock = displayVariant.stock;

  // Image for this variant (or fallback to category image)
  const image = displayVariant.images?.[0] || product.productCategories?.[0]?.categories?.image || '/assets/images/full_logo.png';

  const toggleWishlist = async () => {
    if (variant)
      if (wished) {
        await removeFromWishlistByProduct(variant?.id)
      } else {
        await addToWishlist(variant?.id)
      }
  }

  const shareUrl = window.location.origin + `/product/${product.id}?variant=${displayVariant.id}`
  const shareText = `Check out ${product.title} on 3 Point Arts!`

  return (
    <div className="product-card">
      <div className="image-wrap">
        <Link to={`/product/${product.id}?variant=${displayVariant.id}`} className="img-link">
          <img
            src={image}
            alt={product.title}
            style={{ objectFit: 'cover', height: '100%' }}
          />
        </Link>
        <button
          aria-label="Toggle wishlist"
          className={`heart ${wished ? 'active' : ''}`}
          onClick={toggleWishlist}
        >
          <i className={`fa ${wished ? 'fa-heart' : 'fa-heart-o'}`} style={{ fontSize: '24px', color: "orange" }}></i>
        </button>
      </div>

      <div className="info">
        <div className='row' >
          <h3 className='col-10'>
            <Link to={`/product/${product.id}?variant=${displayVariant.id}`}>
              {product.title}
            </Link>
          </h3>
          <div className='col-2'>
            <i className='fa fa-share-alt' onClick={() => setShowShare(true)} style={{ cursor: 'pointer' }}></i>
          </div>
        </div>

        <div className="rating" onClick={() => navigate(`/product/${product.id}?variant=${displayVariant.id}`)}>
          <span className="stars">★★★★★</span>
          <span className="count">{reviewCount}</span>
        </div>

        <div className="price-block" onClick={() => navigate(`/product/${product.id}?variant=${displayVariant.id}`)}>
          <div className="price-row">
            <span className="currency">₹</span>
            <span className="price-main">{price.toLocaleString()}</span>
            <span className="mrp">M.R.P: <span>₹{mrp.toLocaleString()}</span></span>
            <span className="discount">({discount}% off)</span>
          </div>
          <div className="coupon">
            <span className="badge">Save 2%</span> with coupon
          </div>
        </div>

        <div className="delivery" onClick={() => navigate(`/product/${product.id}?variant=${displayVariant.id}`)}>
          <span className="free">FREE delivery</span>
          <span className="date">{deliveryDate}</span>
        </div>

        <div className="actions mt-2">
          {stock <= 0 ? (
            <span className="out-of-stock">Out of stock</span>
          ) : (
            inCart ?
              (<Link to="/cart"><h3> View in Cart</h3></Link>) : (
                <button
                  className="btn-cart"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(displayVariant.id, 1, { ...displayVariant, product })
                  }}
                >
                  Add to Cart
                </button>
              )
          )}
        </div>
      </div>
      <ShareDialog
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        shareUrl={shareUrl}
        shareText={shareText}
      />
    </div>
  )
}
