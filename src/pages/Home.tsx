import { Link } from 'react-router-dom'
import { categories } from '../data/products'

export default function Home() {
  return (
    <section>
      <div className="hero">
        <img src="/assets/images/full_logo.png" alt="3 Point Arts" />
        <h1>3D Printed Art, Models & Lamps</h1>
        <p>Explore handcrafted 3D prints from 3 Point Arts.</p>
        <Link className="cta" to="/catalog">Browse Catalog</Link>
      </div>
      <div className="categories">
        {categories.map((c) => (
          <Link key={c} to={`/catalog?category=${encodeURIComponent(c)}`} className="category-card">
            <span>{c}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
