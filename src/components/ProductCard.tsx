import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ProductModel } from '../data/model/ProductModel'
import useCartStore from '../state/customer/CartStore'
import useWishlistStore from '../state/customer/WishlistStore'
import type { ProductVariantModel } from '../data/model/ProductVariantModel'
import { showSuccess } from '../core/message'

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
        <div className='row'>
          <h3 className='col-10'>
            <Link to={`/product/${product.id}?variant=${displayVariant.id}`}>
              {product.title}
            </Link>
          </h3>
          <div className='col-2'>
            <i className='fa fa-share-alt' onClick={() => setShowShare(true)} style={{ cursor: 'pointer' }}></i>
          </div>
        </div>

        <div className="rating">
          <span className="stars">★★★★★</span>
          <span className="count">{reviewCount}</span>
        </div>

        <div className="price-block">
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

        <div className="delivery">
          <span className="free">FREE delivery</span>
          <span className="date">{deliveryDate}</span>
        </div>

        <div className="actions">
          {stock <= 0 ? (
            <span className="out-of-stock">Out of stock</span>
          ) : (
            inCart ?
              (<Link to="/cart"><h3> Added to cart</h3></Link>) : (
                <button
                  className="btn-cart"
                  onClick={() => {
                    addToCart(displayVariant.id, 1)
                    navigate('/cart')
                  }}
                >
                  Add to Cart
                </button>
              )
          )}
        </div>
      </div>
      {showShare && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }} onClick={() => setShowShare(false)}>
          <div className="card p-3" style={{ minWidth: '300px', maxWidth: '90%' }} onClick={e => e.stopPropagation()}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="m-0">Share this product</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowShare(false)}></button>
            </div>
            <div className="mb-3">
              <input type="text" className="form-control" value={shareUrl} readOnly onClick={(e) => e.currentTarget.select()} />
            </div>
            <div className="d-flex justify-content-around text-center">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-success d-flex flex-column align-items-center" title="WhatsApp">
                <i className="fa fa-whatsapp fa-2x mb-1"></i>
                <span style={{ fontSize: '0.8rem' }}>WhatsApp</span>
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-primary d-flex flex-column align-items-center" title="Facebook">
                <i className="fa fa-facebook-official fa-2x mb-1"></i>
                <span style={{ fontSize: '0.8rem' }}>Facebook</span>
              </a>
              <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="text-decoration-none text-info d-flex flex-column align-items-center" title="Telegram">
                <i className="fa fa-telegram fa-2x mb-1"></i>
                <span style={{ fontSize: '0.8rem' }}>Telegram</span>
              </a>
              <div onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                showSuccess("Link copied to clipboard!")
                setShowShare(false)
              }} style={{ cursor: 'pointer' }} className="text-secondary d-flex flex-column align-items-center" title="Copy Link">
                <i className="fa fa-clone fa-2x mb-1"></i>
                <span style={{ fontSize: '0.8rem' }}>Copy</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
