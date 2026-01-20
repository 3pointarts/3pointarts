import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState, type FormEvent } from 'react'
import useCustomerAuthStore from '../state/customer/CustomerAuthStore'
import useCartStore from '../state/customer/CartStore'
function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}
function Header() {
  const state = useCustomerAuthStore()
  const cartState = useCartStore()
  const [query, setQuery] = useState('')
  const q = useQuery()
  const queryNew = (q.get('q') || '').toLowerCase()
  useEffect(() => {
    setQuery(queryNew)
  }, [queryNew])
  const navigate = useNavigate()

  function onSearch(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    navigate('/catalog?q=' + encodeURIComponent(q))
  }

  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <div className="header-inner">
        <Link to="/" className="brand">
          <img src="/assets/images/logo.png" alt="3 Point Arts" />
          <img src="/assets/images/name_logo.png" alt="3 Point Arts" />
        </Link>

        <nav className="nav">
          <Link to="/about">About</Link>
          <Link to="/help">Help</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>

        <div className="header-right">
          <div className='pc'>
            <form className="search" onSubmit={onSearch}>
              <input
                // id="search"
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
          </div>
          <div className="user-actions">
            {state.customer ? (
              <>
                <Link to="/cart" className="icon-btn" title="Cart">
                  <div className="icon-badge-wrap">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-4h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-9.2L4.2 3H2v2h1.4l3.6 11.4A2 2 0 0 0 9 16z" />
                    </svg>
                    {cartState.carts.reduce((s, c) => s + c.qty, 0) > 0 && (
                      <span className="badge">{cartState.carts.reduce((s, c) => s + c.qty, 0)}</span>
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
      <div className="mobile" style={{
        width: '100%',
        padding: '0 20px',
      }}>
        <form className="mobile-search mt-2 mx-auto" onSubmit={onSearch}>
          <input
            id="search"
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
      </div>

    </header>
  )
}

export default Header
