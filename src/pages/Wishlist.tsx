import { useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import useWishlistStore from '../state/customer/WishlistStore';
import { Status } from '../core/enum/Status';

export default function Wishlist() {
  const { wishlists, loadWishlists, status } = useWishlistStore();

  useEffect(() => {
    loadWishlists();
  }, [loadWishlists]);

  if (status === Status.loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <section>
      <h2>Wishlist</h2>
      <div className="grid">
        {wishlists.map((w) => (
          w.productVariant && w.productVariant.product && <ProductCard product={w.productVariant.product} variantId={w.productVariant.id} variantOptional={w.productVariant} />

        ))}
        {wishlists.length === 0 && <div>Your wishlist is empty.</div>}
      </div>
    </section>
  )
}
