import { useState, useEffect } from 'react'
import useCustomerOrderStore from '../state/customer/CustomerOrderStore'
import useCustomerAuthStore from '../state/customer/CustomerAuthStore'
import { Status } from '../core/enum/Status'
import { Link } from 'react-router-dom'

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const authStore = useCustomerAuthStore()
  const orderStore = useCustomerOrderStore()

  const {
    contactName, setContactName,
    contactPhone, setContactPhone,
    contactAddress, setContactAddress,
    billTo, setBillTo,
    note, setNote,
    createOrder, createStatus
  } = orderStore

  // Pre-fill fields from user profile if available
  useEffect(() => {
    if (authStore.customer) {
      if (!contactName) setContactName(authStore.customer.name || '')
      if (!contactPhone) setContactPhone(authStore.customer.phone || '')
    }
  }, [authStore.customer])

  const handlePlaceOrder = async () => {
    const success = await createOrder()
    if (success) {
      setTimeout(() => {
        onClose()
      }, 3000)
    }
  }

  if (!authStore.customer) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <button className="close-btn" onClick={onClose}>×</button>
          <div className="notice">
            <h3>Login Required</h3>
            <p>Please login to place an order.</p>
            <Link to="/login" className="btn-primary" onClick={onClose}>Go to Login</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content checkout-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3>Checkout Details</h3>

        {createStatus === Status.success ? (
          <div className="success-message">
            <div className="check-icon-lg">✓</div>
            <h4>Order Placed Successfully!</h4>
            <p>Thank you for your purchase.</p>
            <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
          </div>
        ) : (
          <div className="form-grid">
            <div className="form-group">
              <label>Contact Name *</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Full Name"
              />
            </div>

            <div className="form-group">
              <label>Contact Phone *</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="Phone Number"
              />
            </div>

            <div className="form-group full-width">
              <label>Delivery Address *</label>
              <textarea
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="Complete Address"
                rows={3}
              />
            </div>

            <div className="form-group full-width">
              <label>Bill To (Name/Company) *</label>
              <input
                type="text"
                value={billTo}
                onChange={(e) => setBillTo(e.target.value)}
                placeholder="Billing Name"
              />
            </div>

            <div className="form-group full-width">
              <label>Order Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Any special instructions..."
                rows={2}
              />
            </div>

            <div className="form-actions">
              <button className="btn-secondary" onClick={onClose}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handlePlaceOrder}
                disabled={createStatus === Status.loading}
              >
                {createStatus === Status.loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            position: relative;
            max-height: 90vh;
            overflow-y: auto;
        }
        .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
        }
        .form-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .full-width {
            grid-column: span 2;
        }
        .form-group label {
            font-weight: 500;
            font-size: 0.9rem;
        }
        .form-group input, .form-group textarea {
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .form-actions {
            grid-column: span 2;
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1rem;
        }
        .btn-primary {
            background: #ffd814;
            border: 1px solid #fcd200;
            padding: 0.75rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 500;
        }
        .btn-secondary {
            background: white;
            border: 1px solid #ddd;
            padding: 0.75rem 1.5rem;
            border-radius: 20px;
            cursor: pointer;
        }
        .success-message {
            text-align: center;
            padding: 2rem 0;
        }
        .check-icon-lg {
            font-size: 3rem;
            color: green;
            margin-bottom: 1rem;
        }
      `}</style>
    </div>
  )
}
