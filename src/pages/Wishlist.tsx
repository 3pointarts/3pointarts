import { useStore } from '../state/Store'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { state } = useStore()
  const items = state.products.filter((p) => state.wishlist.includes(p.id))
  return (
    <section>
      <h2>Wishlist</h2>
      <div className="grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {items.length === 0 && <div>Your wishlist is empty.</div>}
      </div>
    </section>
  )
}
