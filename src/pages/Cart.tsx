import { Link } from 'react-router-dom'
import { useState } from 'react'
import useCartStore from '../state/customer/CartStore'
import useCustomerAuthStore from '../state/customer/CustomerAuthStore';
import ShareDialog from '../components/ShareDialog';

export default function Cart() {
  const store = useCartStore();
  const astore = useCustomerAuthStore();
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent] = useState(0)
  const [shareData, setShareData] = useState({ show: false, url: '', text: '' })

  const totalItems = store.carts.reduce((sum, item) => sum + item.qty, 0)

  // Simulate MRP (e.g., 20% higher than price)
  const totalMrp = store.carts.reduce((sum, item) => {
    return sum + ((item.productVariant?.price ?? 0) * 1.2 * item.qty)
  }, 0)

  const totalSellingPrice = store.carts.reduce((sum, item) => {
    return sum + ((item.productVariant?.price ?? 0) * item.qty)
  }, 0)

  const hasOutOfStock = store.carts.some(item => item.productVariant && item.productVariant.stock <= 0)

  const productDiscount = totalMrp - totalSellingPrice

  // Coupon Logic
  const handleApplyCoupon = () => {
    // if (couponCode.trim().toUpperCase() === 'BIRTHDAY') {
    //   setDiscountPercent(10) // 10% discount
    // } else {
    //   setDiscountPercent(0)
    //   if (couponCode.trim()) alert('Invalid Coupon Code')
    // }
  }

  const couponDiscountAmount = (totalSellingPrice * discountPercent) / 100

  // Delivery Logic (Free above 500)
  const deliveryCharges = totalSellingPrice > 200 ? 0 : 40

  const finalTotal = totalSellingPrice - couponDiscountAmount + deliveryCharges




  return (
    <div className="cart-page">
      <div className="cart-layout">

        {/* Left Column: Cart Items */}
        <div className="cart-items-container">
          <div className="cart-header">
            <h2>Shopping Cart</h2>
            <button className="link-button" onClick={() => store.clearCart()}>Delete all items</button>
            <span className="price-label">Price</span>
          </div>

          {store.carts.length === 0 ? (
            <div className="empty-cart-message">
              <p>Your Cart is empty.</p>
              <Link to="/" className="link-button">Shop today's deals</Link>
              <div className="auth-buttons" style={{ marginTop: '1rem' }}>
                {!astore.customer && (
                  <>
                    <Link to="/login" className="btn-primary-sm">Sign in to your account</Link>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="cart-list">
              {store.carts.map((item) => {
                const variant = item.productVariant
                const product = variant?.product
                if (!variant || !product) return null

                // Determine image to show (variant image or product category image or default)
                const image = variant.images?.[0] || 'https://via.placeholder.com/180'

                return (
                  <div className="cart-item-card" key={item.id}>

                    {/* Item Checkbox */}
                    {/* <div className="item-checkbox">
                      <input type="checkbox" defaultChecked />
                    </div> */}

                    {/* Item Image */}
                    <div className="item-image">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={image}
                          alt={product.title}
                        />
                      </Link>
                    </div>

                    {/* Item Details */}
                    <div className="item-details">
                      <div className="item-header-row">
                        <Link to={`/product/${product.id}`} className="item-title">
                          {product.title} ({variant.color})
                        </Link>
                        <div className="item-price-mobile">
                          <span className="price-symbol">₹</span>
                          <span className="price-whole">{Math.floor((variant.price * item.qty)).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="item-stock-status">{variant.stock > 0 ? (variant.stock > 10 ? 'In stock' : 'Only ' + variant.stock + ' left') : 'Out of stock'}</div>
                      <div className="item-shipping-badge">Eligible for FREE Shipping</div>

                      {/* <div className="item-gift-option">
                        <input type="checkbox" id={`gift-${item.id}`} />
                        <label htmlFor={`gift-${item.id}`}>This will be a gift</label>
                        <a href="#" className="link-button">Learn more</a>
                      </div> */}

                      <div className="item-controls">

                        {variant.stock <= 0 ? (
                          <span className="out-of-stock">Out of stock</span>
                        ) : (
                          <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', marginRight: '10px' }}>
                            <button
                              onClick={() => {
                                if (item.qty > 1) {
                                  store.updateCartQty(item.id, item.productVariantId, item.qty - 1)
                                }
                              }}
                              style={{ padding: '2px 8px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRight: '1px solid #ddd' }}
                            >
                              -
                            </button>
                            <span style={{ padding: '0 10px', minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                            <button
                              onClick={() => store.updateCartQty(item.id, item.productVariantId, variant.stock >= item.qty + 1 ? item.qty + 1 : item.qty)}
                              style={{ padding: '2px 8px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderLeft: '1px solid #ddd' }}
                            >
                              +
                            </button>
                          </div>
                        )}
                        <div className="control-links">
                          <button
                            className="link-button"
                            onClick={() => {
                              store.removeFromCart(item.id)
                            }}
                          >
                            Delete
                          </button>
                          <button className="link-button" onClick={() => {
                            const url = window.location.origin + `/product/${product.id}?variant=${variant.id}`;
                            const text = `Check out ${product.title} on 3 Point Arts!`;
                            setShareData({ show: true, url, text });
                          }}>Share</button>
                          <Link to={`/catalog?category=${encodeURIComponent(product.productCategories[0].categories.id)}`} className="link-button">See more like this</Link>

                        </div>
                      </div>
                    </div>

                    {/* Item Price (Desktop) */}
                    <div className="item-price">
                      <span className="price-symbol">₹</span>
                      <span className="price-whole">{Math.floor((variant.price * item.qty)).toLocaleString()}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {store.carts.length > 0 && (
            <div className="cart-subtotal-row">
              <span className="subtotal-label">Subtotal ({totalItems} items):</span>
              <span className="subtotal-amount">₹{finalTotal.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Right Column: Summary Box */}
        {store.carts.length > 0 && (
          <div className="cart-right-column">
            <div className="cart-summary-box">
              <div className="delivery-check">
                <div className="check-icon">✓</div>
                <div className="check-text">
                  <span className="green-text">Part of your order qualifies for FREE Delivery.</span>
                  {' '}Select this option at checkout. <a href="#" className="link-button">Details</a>
                </div>
              </div>

              <div className="summary-subtotal">
                <div className="summary-row">
                  <span>Price ({totalItems} items)</span>
                  <span>₹{Math.floor(totalMrp).toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Discount</span>
                  <span className="success-text">- ₹{Math.floor(productDiscount).toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="summary-row">
                    <span>Coupon Savings</span>
                    <span className="success-text">- ₹{Math.floor(couponDiscountAmount).toLocaleString()}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharges === 0 ? <span className="success-text">FREE</span> : `₹${deliveryCharges}`}
                  </span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total-row">
                  <span>Total Amount</span>
                  <span>₹{Math.floor(finalTotal).toLocaleString()}</span>
                </div>
              </div>

              <div className="summary-gift">
                <input type="checkbox" id="cart-gift" />
                <label htmlFor="cart-gift">This order contains a gift</label>
              </div>

              <div className="coupon-section">
                <div className="coupon-input-group">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button className="btn-apply-coupon" onClick={handleApplyCoupon}>
                    {discountPercent > 0 ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {discountPercent > 0 && <div className="coupon-success">"BIRTHDAY" applied!</div>}
              </div>
              <div className='checkout-btn'>
                {hasOutOfStock ? (
                  <>
                    <button className="btn-proceed-buy" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                      Proceed to Buy
                    </button>
                    <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                      Remove out of stock product from cart first
                    </p>
                  </>
                ) : (
                  <Link to="/checkout" className="btn-proceed-buy">
                    Proceed to Buy
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      <ShareDialog
        isOpen={shareData.show}
        onClose={() => setShareData({ ...shareData, show: false })}
        shareUrl={shareData.url}
        shareText={shareData.text}
      />
    </div>
  )
}
