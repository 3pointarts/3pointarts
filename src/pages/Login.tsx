import { useState } from 'react'
import { useStore } from '../state/Store'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const { state, actions } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  
  const [email, setEmail] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [name, setName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState<string | null>(null)

  // Step 1: Request OTP
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    const code = actions.requestOtp(email)
    setOtpSent(code)
    setStep(2)
    setError('')
  }

  // Step 2: Verify OTP locally
  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    const correctOtp = state.otpByEmail[email]
    if (otpInput === correctOtp) {
      setStep(3)
      setError('')
    } else {
      setError('Invalid OTP. Please try again.')
    }
  }

  // Step 3: Complete Profile & Login
  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = actions.verifyOtp(email, otpInput, name, phoneNumber)
    if (ok) {
      navigate('/dashboard')
    } else {
      setError('Something went wrong during verification.')
    }
  }

  return (
    <div className="login-page">
      <h2>Login</h2>
      
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="login-form">
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="Enter your email"
            />
          </div>
          <button type="submit" className="btn-primary">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleOtpSubmit} className="login-form">
          <p>We sent an OTP to {email}</p>
          {otpSent && <div className="otp-demo">Demo OTP: {otpSent}</div>}
          
          <div className="form-group">
            <label>Enter OTP</label>
            <input 
              type="text" 
              value={otpInput} 
              onChange={e => setOtpInput(e.target.value)} 
              required 
              placeholder="6-digit OTP"
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Next</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleDetailsSubmit} className="login-form">
          <p>Almost there! Just a few more details.</p>
          
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Your Name"
            />
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              value={phoneNumber} 
              onChange={e => setPhoneNumber(e.target.value)} 
              required 
              placeholder="Your Phone Number"
            />
          </div>
          
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-primary">Complete Login</button>
        </form>
      )}
    </div>
  )
}
