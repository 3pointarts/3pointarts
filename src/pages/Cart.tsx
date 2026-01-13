import { Link } from 'react-router-dom'
import { useState } from 'react'
import useCartStore from '../state/customer/CartStore'
import useAdminProductStore from '../state/admin/AdminProductStore';
import useCustomerAuthStore from '../state/customer/CustomerAuthStore';
import CheckoutModal from '../components/CheckoutModal';

export default function Cart() {
  const store = useCartStore();
  const astore = useCustomerAuthStore();
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [showCheckout, setShowCheckout] = useState(false)

  const totalItems = store.carts.reduce((sum, item) => sum + item.qty, 0)

  // Simulate MRP (e.g., 20% higher than price)
  const totalMrp = store.carts.reduce((sum, item) => {
    return sum + (item.product?.price ?? 0 * 1.2 * item.qty)
  }, 0)

  const totalSellingPrice = store.carts.reduce((sum, item) => {
    return sum + ((item.product?.price ?? 0) * item.qty)
  }, 0)

  const hasOutOfStock = store.carts.some(item => item.product && item.product.stock <= 0)

  const productDiscount = totalMrp - totalSellingPrice

  // Coupon Logic
  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'BIRTHDAY') {
      setDiscountPercent(10) // 10% discount
    } else {
      setDiscountPercent(0)
      if (couponCode.trim()) alert('Invalid Coupon Code')
    }
  }

  const couponDiscountAmount = (totalSellingPrice * discountPercent) / 100

  // Delivery Logic (Free above 500)
  const deliveryCharges = totalSellingPrice > 500 ? 0 : 40

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
                const product = item.product
                if (!product) return null

                return (
                  <div className="cart-item-card" key={item.productId}>

                    {/* Item Checkbox */}
                    <div className="item-checkbox">
                      <input type="checkbox" defaultChecked />
                    </div>

                    {/* Item Image */}
                    <div className="item-image">
                      <Link to={`/product/${item.productId}`}>
                        <img
                          src={product.images[0] || 'https://via.placeholder.com/180'}
                          alt={product.title}
                        />
                      </Link>
                    </div>

                    {/* Item Details */}
                    <div className="item-details">
                      <div className="item-header-row">
                        <Link to={`/product/${item.productId}`} className="item-title">
                          {product.title}
                        </Link>
                        <div className="item-price-mobile">
                          <span className="price-symbol">₹</span>
                          <span className="price-whole">{Math.floor((product.price * item.qty)).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="item-stock-status">In stock</div>
                      <div className="item-shipping-badge">Eligible for FREE Shipping</div>

                      <div className="item-gift-option">
                        <input type="checkbox" id={`gift-${item.productId}`} />
                        <label htmlFor={`gift-${item.productId}`}>This will be a gift</label>
                        <a href="#" className="link-button">Learn more</a>
                      </div>

                      <div className="item-controls">

                        {product.stock <= 0 ? (
                          <span className="out-of-stock">Out of stock</span>
                        ) : (
                          <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', marginRight: '10px' }}>
                            <button
                              onClick={() => {
                                if (item.qty > 1) {
                                  store.updateCartQty(item.id, product.id, item.qty - 1)
                                }
                              }}
                              style={{ padding: '2px 8px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRight: '1px solid #ddd' }}
                            >
                              -
                            </button>
                            <span style={{ padding: '0 10px', minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{item.qty}</span>
                            <button
                              onClick={() => store.updateCartQty(item.id, product.id, item.qty + 1)}
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
                          <span className="separator">|</span>
                          <Link to={`/catalog?category=${encodeURIComponent(product.categoryId)}`} className="link-button">See more like this</Link>
                          <span className="separator">|</span>
                          <button className="link-button">Share</button>
                        </div>
                      </div>
                    </div>

                    {/* Item Price (Desktop) */}
                    <div className="item-price">
                      <span className="price-symbol">₹</span>
                      <span className="price-whole">{Math.floor((product.price * item.qty)).toLocaleString()}</span>
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
        )}

      </div>
    </div>
  )
}
