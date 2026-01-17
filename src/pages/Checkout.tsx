import { useEffect } from 'react';
import useCustomerAuthStore from '../state/customer/CustomerAuthStore';
import useCustomerOrderStore from '../state/customer/CustomerOrderStore';
import useCartStore from '../state/customer/CartStore';
import { Link, useNavigate } from 'react-router-dom';
import { Status } from '../core/enum/Status';
import { showError } from '../core/message';

export default function Checkout() {
  const navigate = useNavigate();
  // return (
  //   <section>
  //     <h2>Checkout</h2>
  //     <CheckoutModal onClose={() => { navigate('/cart') }} />
  //   </section>
  // )
  const authStore = useCustomerAuthStore()
  const orderStore = useCustomerOrderStore()
  const cartStore = useCartStore()
  const onClose = () => { navigate('/dashboard') }
  const {
    contactName, setContactName,
    contactPhone, setContactPhone,
    contactAddress, setContactAddress,
    billTo, setBillTo,
    note, setNote,
    createOrder, createStatus
  } = orderStore

  // Calculate Total
  const totalAmount = cartStore.carts.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0)

  // Pre-fill fields from user profile if available
  useEffect(() => {
    if (authStore.customer) {
      if (!contactName) setContactName(authStore.customer.name || '')
      if (!contactPhone) setContactPhone(authStore.customer.phone || '')
    }
  }, [authStore.customer])

  const handlePlaceOrder = async () => {
    // Validate fields before payment
    if (!contactName || !contactPhone || !contactAddress || !billTo) {
      showError("Please fill in all required fields");
      return;
    }

    const options = {
      key: "rzp_test_S50EsU82jDuenn", // Enter the Key ID generated from the Dashboard
      amount: totalAmount * 100, // Amount is in currency subunits. Default currency is INR.
      currency: "INR",
      name: "3 Point Arts",
      description: "Transaction for 3 Point Arts",
      image: "/assets/images/logo.png",
      handler: async function (response: any) {
        console.log("Payment Successful", response);
        // Payment successful, now create the order
        const success = await createOrder()
        if (success) {
          setTimeout(() => {
            onClose()
          }, 3000)
        }
      },
      prefill: {
        name: contactName,
        email: authStore.customer?.email || '',
        contact: contactPhone
      },
      notes: {
        address: contactAddress
      },
      theme: {
        color: "#3399cc"
      }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.on('payment.failed', function (response: any) {
      showError(`Payment Failed: ${response.error.description}`);
    });
    rzp1.open();
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
    <section className='checkout-section'>

      <h3>Checkout Details</h3>

      {createStatus === Status.success ? (
        <div className="success-message">
          <div className="check-icon-lg">✓</div>
          <h4>Order Placed Successfully!</h4>
          <p>Thank you for your purchase.</p>
          <button className="btn-primary" onClick={onClose}>Continue Shopping</button>
        </div>
      ) : (
        <div className="row mb-5">
          <div className="form-group col-md-4 full-width">
            <label>Contact Name *</label>
            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Full Name"
            />
          </div>

          <div className="form-group col-md-4 full-width">
            <label>Contact Phone *</label>
            <input
              type="text"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Phone Number"
            />
          </div>
          <div className="form-group col-md-4 full-width">
            <label>Bill To (Name/Company) *</label>
            <input
              type="text"
              value={billTo}
              onChange={(e) => setBillTo(e.target.value)}
              placeholder="Billing Name"
            />
          </div>
          <div className="form-group col-md-6 full-width">
            <label>Delivery Address *</label>
            <textarea
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              placeholder="Complete Address"
              rows={3}
            />
          </div>



          <div className="form-group col-md-6 full-width">
            <label>Order Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special instructions..."
              rows={3}
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
            .checkout-section {
                .form-group label {
                   text-align: left;
                }
            }
      `}</style>
    </section>
  )
}
