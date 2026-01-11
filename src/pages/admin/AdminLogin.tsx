import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin.css';
import useAdminAuthStore from '../../state/admin/AdminAuthStore';
import { Status } from '../../core/enum/Status';
export default function AdminLogin() {
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    // Selectors must be at the top level
    const email = useAdminAuthStore((state) => state.email);
    const admin = useAdminAuthStore((state) => state.admin);
    const password = useAdminAuthStore((state) => state.password);
    const loginStatus = useAdminAuthStore((state) => state.loginStatus);
    const setEmail = useAdminAuthStore((state) => state.setEmail);
    const setPassword = useAdminAuthStore((state) => state.setPassword);
    const login = useAdminAuthStore((state) => state.login);

    useEffect(() => {
        if (admin != null) {
            navigate('/admin/dashboard');
        }
    }, [loginStatus, navigate]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        // Mock login logic
        // if (email === 'admin@gmail.com' && password === '123456') {
        //     setMessage('Login Successful! Welcome Admin.')
        //     setTimeout(() => {
        //         navigate('/admin/dashboard')
        //     }, 1000)
        // } else {
        //     setMessage('Invalid credentials. Please try again.')
        // }
        login();
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
                    {loginStatus === Status.loading ?
                        <div className="loading-spinner"></div> :
                        <button type="submit" className="btn-primary ">Login</button>}
                </form>
                {message && <div className={`message ${message.includes('Successful') ? 'success' : 'error'}`}>{message}</div>}
            </div>
        </div>
    )
}
