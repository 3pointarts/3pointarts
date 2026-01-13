import { Link } from 'react-router-dom'
import HomeCarousel from '../components/HomeCarousel'
import useAdminProductStore from '../state/admin/AdminProductStore'
import { useEffect } from 'react'
const categoryImages: Record<string, string> = {
  'Lamp': '/assets/images/lamp.png',
  'Statue': '/assets/images/statue.jpg',
  'Cars': '/assets/images/car.jpg',
  'Lego Toys': '/assets/images/lego.jpg'
}

export default function Home() {
  const productStore = useAdminProductStore()
  useEffect(() => {
    productStore.init()
  }, [])
  return (
    <section>
      <HomeCarousel />
      <div className="hero mb-1">

        <h1>3D Printed Art, Models & Lamps</h1>
        <p>Explore handcrafted 3D prints from 3 Point Arts.</p>
        <Link className="cta" to="/catalog">Browse Catalog</Link>
      </div>
      <div className="categories">
        {productStore.categories.map((c, index) => (
          <Link key={c.id} to={`/catalog?category=${encodeURIComponent(c.id)}`} className="category-card">
            <div className="category-image">
              <img src={c.image || categoryImages[index] || '/assets/images/full_logo.png'} alt={c.name} />
            </div>
            <span>{c.name}</span>
          </Link>
        ))}
      </div>

      <div className="offers-section">
        <div className="offers-container">
          <h2>What <span className="highlight">3Point Arts Studio</span> Offer</h2>
          <div className="offers-divider"></div>

          <div className="offers-grid">
            <div className="offer-item">
              <div className="offer-number">01</div>
              <div className="offer-text">Premium Quality</div>
            </div>
            <div className="offer-item">
              <div className="offer-number">02</div>
              <div className="offer-text">Affordable Price</div>
            </div>
            <div className="offer-item">
              <div className="offer-number">03</div>
              <div className="offer-text">Safe Packaging</div>
            </div>
            <div className="offer-item">
              <div className="offer-number">04</div>
              <div className="offer-text">Fast Delivery</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
