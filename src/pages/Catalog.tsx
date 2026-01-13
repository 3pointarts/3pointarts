import { useMemo, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useAdminProductStore from '../state/admin/AdminProductStore'
import ProductCard from '../components/ProductCard'
import { Status } from '../core/enum/Status'

function useQuery() {
  const { search } = useLocation()
  return useMemo(() => new URLSearchParams(search), [search])
}

export default function Catalog() {
  const { products, categories, init, initStatus } = useAdminProductStore()
  const q = useQuery()
  const query = (q.get('q') || '').toLowerCase()
  const categoryParam = q.get('category')
  const categoryId = categoryParam ? parseInt(categoryParam, 10) : null

  useEffect(() => {
    if (initStatus === Status.init) {
      init()
    }
  }, [init, initStatus])

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>(categoryId ? [categoryId] : [])
  type SortOpt = 'featured' | 'price-asc' | 'price-desc'
  const [sort, setSort] = useState<SortOpt>('featured')

  // Update selected categories if URL param changes
  useEffect(() => {
    if (categoryId) {
      setSelectedCatIds([categoryId])
    }
  }, [categoryId])

  const prices = products.map((p) => p.price)
  const floor = prices.length ? Math.min(...prices) : 0
  const ceil = prices.length ? Math.max(...prices) : 5000

  // Calculate effective min/max
  const min = Math.max(minPrice || floor, floor)
  const max = Math.min(maxPrice || ceil, ceil)

  const filtered = products
    .filter((p) => {
      const matchQ =
        !query || p.title.toLowerCase().includes(query) || p.about.toLowerCase().includes(query)
      const matchC = selectedCatIds.length === 0 || selectedCatIds.includes(p.categoryId)
      const matchP = p.price >= min && p.price <= max
      return matchQ && matchC && matchP
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return 0
    })

  function toggleCat(id: number) {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  if (initStatus === Status.loading) {
    return <div className="text-center p-5">Loading products...</div>
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
                  <div className="form-check" key={c.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`cat-${c.id}`}
                      checked={selectedCatIds.includes(c.id)}
                      onChange={() => toggleCat(c.id)}
                    />
                    <label className="form-check-label" htmlFor={`cat-${c.id}`}>
                      {c.name}
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
            {filtered.map((p) => {
              return <ProductCard key={p.id} product={p} />
            })}
            {filtered.length === 0 && <div>No products found.</div>}
          </div>
        </div>
      </div>
    </section>
  )
}
