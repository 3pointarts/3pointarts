import { useEffect, useState } from 'react'
import useCustomerAuthStore from '../state/customer/CustomerAuthStore'
import { useNavigate } from 'react-router-dom'
import { Status } from '../core/enum/Status'

export default function Login() {
  const store = useCustomerAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  // Step 1: Request OTP
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!store.email) return
    await store.sendOtp()
    if (store.otpStatus === Status.success) {
      store.setStep(2)
      setError('')
    }
  }

  // Step 2: Verify OTP
  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    const isValid = store.verifyOtp(store.otp)
    if (isValid) {
      // Check if user exists
      const exists = await store.checkUserExists()
      if (exists) {
        // Login
        await store.login()
        if (useCustomerAuthStore.getState().loginStatus === Status.success) {
          navigate('/dashboard')
        }
      } else {
        // New user -> Go to Step 3
        store.setStep(3)
        setError('')
      }
    } else {
      setError('Invalid OTP. Please try again.')
    }
  }

  // Step 3: Complete Profile & Register
  async function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    await store.register()
    if (store.loginStatus === Status.success) {
      navigate('/dashboard')
    } else {
      setError('Registration failed. Please try again.')
    }
  }

  useEffect(() => {
    if (store.loginStatus === Status.success) {
      navigate('/dashboard')
    }
  }, [store.loginStatus, navigate])


  return (
    <div className="login-page">
      <div className='d-flex'>
        {store.step !== 1 && <i className='fa fa-angle-left' onClick={() => store.setStep(1)} style={{ cursor: 'pointer', fontSize: '24px' }}></i>}
      </div>
      <h2>Login</h2>


      {store.step === 1 && (
        <form onSubmit={handleEmailSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={store.email}
              onChange={e => store.setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={store.otpStatus === Status.loading}>
            {store.otpStatus === Status.loading ? 'Sending...' : 'Next'}
          </button>
        </form>
      )}

      {store.step === 2 && (
        <form onSubmit={handleOtpSubmit} className="login-form">
          <p>We sent an OTP to {store.email}</p>
          {/* In a real app, don't show the OTP here */}
          <div className="otp-demo">Demo OTP: {store.generatedOtp}</div>

          <div className="form-group">
            <label>Enter OTP</label>
            <input
              type="text"
              value={store.otp}
              onChange={e => store.setOtp(e.target.value)}
              required
              placeholder="4-digit OTP"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={store.loginStatus === Status.loading}>
            {store.loginStatus === Status.loading ? 'Verifying...' : 'Next'}
          </button>
        </form>
      )}

      {store.step === 3 && (
        <form onSubmit={handleDetailsSubmit} className="login-form">
          <p>Almost there! Just a few more details.</p>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={store.name}
              onChange={e => store.setName(e.target.value)}
              required
              placeholder="Your Name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={store.phone}
              onChange={e => store.setPhone(e.target.value)}
              required
              placeholder="Your Phone Number"
            />
          </div>

          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={store.loginStatus === Status.loading}>
            {store.loginStatus === Status.loading ? 'Complete Login' : 'Complete Login'}
          </button>
        </form>
      )}
    </div>
  )
}
