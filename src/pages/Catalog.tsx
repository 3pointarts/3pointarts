import { useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../state/Store'
import ProductCard from '../components/ProductCard'
import { categories } from '../data/products'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Catalog() {
  const { state } = useStore()
  const q = useQuery()
  const query = (q.get('q') || '').toLowerCase()
  const category = q.get('category') || ''

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedCats, setSelectedCats] = useState<string[]>(category ? [category] : [])
  type SortOpt = 'featured' | 'price-asc' | 'price-desc'
  const [sort, setSort] = useState<SortOpt>('featured')

  const prices = state.products.map((p) => p.price)
  const floor = Math.min(...prices)
  const ceil = Math.max(...prices)
  const min = Math.min(minPrice || floor, ceil)
  const max = Math.max(maxPrice || ceil, floor)

  const filtered = state.products
    .filter((p) => {
      const matchQ =
        !query || p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
      const matchC = selectedCats.length === 0 || selectedCats.includes(p.category)
      const matchP = p.price >= min && p.price <= max
      return matchQ && matchC && matchP
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  function toggleCat(c: string) {
    setSelectedCats((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    )
  }

  return (
    <section>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Filters</h4>
              <div className="mb-3">
                <label className="form-label">Sort</label>
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOpt)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                {categories.map((c) => (
                  <div className="form-check" key={c}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cat-${c}`}
                      checked={selectedCats.includes(c)}
                      onChange={() => toggleCat(c)}
                    />
                    <label className="form-check-label" htmlFor={`cat-${c}`}>
                      {c}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-2">
                <label className="form-label">Price Range</label>
                <input
                  className="form-range"
                  type="range"
                  min={floor}
                  max={ceil}
                  value={min}
                  onChange={(e) => setMinPrice(parseInt(e.target.value, 10))}
                />
                <input
                  className="form-range"
                  type="range"
                  min={floor}
                  max={ceil}
                  value={max}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                />
                <div className="text-muted">₹{min} — ₹{max}</div>
              </div>
            </div>
          </div>
        </aside>
        <div>
          {query && <div className="hint">Showing results for “{query}”</div>}
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
            {filtered.length === 0 && <div>No products found.</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
