import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../state/Store'
import { useState, type FormEvent } from 'react'

function Header() {
  const { state } = useStore()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate('/catalog?q=' + encodeURIComponent(q))
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/assets/images/name_logo.png" alt="3 Point Arts" />
        </Link>

        <nav className="nav">
          <Link to="/about">About</Link>
          <Link to="/help">Help</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <div className="header-right">
          <form className="search" onSubmit={onSearch}>
            <input
              type="search"
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
          </form>

          <div className="user-actions">
            {state.user ? (
              <>
                <Link to="/cart" className="icon-btn" title="Cart">
                  <div className="icon-badge-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9.2L4.2 3H2v2h1.4l3.6 11.4A2 2 0 0 0 9 16z" />
                    </svg>
                    {state.cart.reduce((s, c) => s + c.qty, 0) > 0 && (
                      <span className="badge">{state.cart.reduce((s, c) => s + c.qty, 0)}</span>
                    )}
                  </div>
                </Link>
                <Link to="/dashboard" className="icon-btn" title="Profile">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </Link>
              </>
            ) : (
              <Link to="/login" className="btn-login">Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
