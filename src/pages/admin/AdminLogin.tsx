import { useState } from 'react';
import './admin.css';
export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Mock login logic
        if (email === 'admin@gmail.com' && password === '123456') {
            setMessage('Login Successful! Welcome Admin.')
        } else {
            setMessage('Invalid credentials. Please try again.')
        }
    }

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary ">Login</button>
                </form>
                {message && <div className={`message ${message.includes('Successful') ? 'success' : 'error'}`}>{message}</div>}
            </div>
        </div>
    )
}
