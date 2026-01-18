import { useParams, Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import useAdminProductStore from '../state/admin/AdminProductStore'
import { Status } from '../core/enum/Status'
import useCartStore from '../state/customer/CartStore'
import useWishlistStore from '../state/customer/WishlistStore'
import { SEO } from '../components/SEO'

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { products, init, initStatus } = useAdminProductStore()
  const { addToCart } = useCartStore()
  const { wishlists, addToWishlist, removeFromWishlistByProduct } = useWishlistStore()
  const cstore = useCartStore()
  const [qty, setQty] = useState(1);
  const [mainImage, setMainImage] = useState('')

  const product = products.find((p) => p.id == Number(id))
  const wished = wishlists.some(w => w.productId === product?.id)



  const reviews = useMemo(() => {
    const list = [
      { id: 1, user: "Ravi Kumar", rating: 5, date: "10 Dec 2024", title: "Great product!", content: "Really loved the quality. Worth the price." },
      { id: 2, user: "Anita Singh", rating: 4, date: "15 Dec 2024", title: "Good, but delivery late", content: "Product is amazing but delivery took 2 days extra." },
      { id: 3, user: "John Doe", rating: 5, date: "20 Dec 2024", title: "Perfect fit", content: "Fits perfectly and looks exactly like the image." },
      { id: 4, user: "Priya M", rating: 3, date: "22 Dec 2024", title: "Average", content: "It's okay for the price, not the best quality." },
      { id: 5, user: "Suresh Raina", rating: 5, date: "24 Dec 2024", title: "Exceeded Expectations", content: "I was a bit skeptical at first about ordering 3D printed items online, but this exceeded my expectations. The finish is smooth and the details are incredible." },
      { id: 6, user: "Meera Patel", rating: 5, date: "25 Dec 2024", title: "Stunning Art Piece", content: "Absolutely stunning piece of art. It looks even better in person than it does in the pictures. The lighting effect is subtle yet powerful, creating a great ambiance." },
      { id: 7, user: "Vikram Singh", rating: 5, date: "26 Dec 2024", title: "Secure Packaging", content: "The packaging was very secure, ensuring the item arrived without a scratch. The product itself is high quality and feels very durable. Will definitely buy again." },
      { id: 8, user: "Rahul Dravid", rating: 5, date: "28 Dec 2024", title: "Perfect Gift", content: "I bought this as a gift for my brother and he absolutely loves it. The craftsmanship is top-notch and it's a unique piece that you can't find anywhere else." },
      { id: 9, user: "Anjali Sharma", rating: 4, date: "30 Dec 2024", title: "Good Quality", content: "A bit smaller than I expected, but the quality makes up for it. The texture is really interesting and adds a nice touch to my living room decor. Recommended." },
      { id: 10, user: "Amitabh B", rating: 5, date: "02 Jan 2025", title: "Great Service", content: "Customer service was very helpful when I had a question about shipping. The product arrived on time and was exactly as described. Very happy with my purchase." },
      { id: 11, user: "Deepika P", rating: 5, date: "05 Jan 2025", title: "Repeat Customer", content: "This is my second purchase from 3 Point Arts and they never disappoint. The attention to detail is amazing. It's a great conversation starter for guests." },
      { id: 12, user: "Ranveer S", rating: 5, date: "08 Jan 2025", title: "Vibrant Colors", content: "The colors are vibrant and the print quality is excellent. No rough edges or loose strings. It's clear that a lot of care went into making this product." },
      { id: 13, user: "Alia B", rating: 4, date: "10 Jan 2025", title: "Sturdy Build", content: "I'm impressed by the sturdy build quality. It doesn't feel fragile at all like some other 3D printed items I've seen. Great value for the money." },
      { id: 14, user: "Shahrukh K", rating: 4, date: "12 Jan 2025", title: "Worth the Wait", content: "Shipping took a little longer than stated, but it was worth the wait. The unique design and custom feel make it a standout piece in my collection." },
      { id: 15, user: "Salman K", rating: 5, date: "15 Jan 2025", title: "Creative Design", content: "Five stars for the creativity! I love how this looks on my desk. It functions perfectly and adds a modern touch to my workspace. Highly recommended." },
      { id: 16, user: "Katrina K", rating: 5, date: "18 Jan 2025", title: "Eco-friendly Feel", content: "The material used feels premium and eco-friendly. I appreciate the sustainable approach. The design is intricate and flawless. A masterpiece!" },
      { id: 17, user: "Akshay K", rating: 5, date: "20 Jan 2025", title: "Perfect Match", content: "Exactly what I was looking for. It matches my room's theme perfectly. The LED light is bright enough to be useful but soft enough to be relaxing." },
      { id: 18, user: "Kareena K", rating: 4, date: "22 Jan 2025", title: "Elegant Look", content: "Great product, but I wish there were more color options available. However, the white one I got is very elegant and fits well with any decor." },
      { id: 19, user: "Saif Ali K", rating: 5, date: "25 Jan 2025", title: "Unique Geometry", content: "I was surprised by how lightweight it is, yet it feels very solid. The geometric patterns are mesmerizing to look at. A truly unique piece of art." },
      { id: 20, user: "Hrithik R", rating: 5, date: "28 Jan 2025", title: "Kid Friendly", content: "My kids love it! It's durable enough to handle some rough play, although it's meant for display. The details are safe and smooth for children." },
      { id: 21, user: "Aamir K", rating: 5, date: "30 Jan 2025", title: "Cool Night Light", content: "The glow in the dark feature is a nice surprise. It looks really cool at night. The daytime look is clean and professional. Very satisfied." },
      { id: 22, user: "Ajay D", rating: 5, date: "02 Feb 2025", title: "Consistent Quality", content: "I've recommended this shop to all my friends. The quality consistency is commendable. Each piece feels like a custom work of art made just for you." },
      { id: 23, user: "Kajol D", rating: 4, date: "05 Feb 2025", title: "Easy Assembly", content: "The assembly was straightforward and easy. It came with clear instructions. The final result looks professional and adds character to the room." },
      { id: 24, user: "Madhuri D", rating: 4, date: "08 Feb 2025", title: "Justified Price", content: "Honest review: The price is a bit high, but considering the custom nature and the quality of the print, I think it is justified. No regrets." },
    ]
    return list.sort(() => Math.random() - 0.5)
  }, [])

  useEffect(() => {
    if (initStatus === Status.init) {
      init()
    }
  }, [init, initStatus])

  if (initStatus === Status.loading || initStatus === Status.init) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Loading Product...</h2>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page">
        <SEO title="Product Not Found" description="The requested product could not be found." />
        <h2>Product Not Found</h2>
        <Link to="/catalog" className="btn-link">Back to Catalog</Link>
      </div>
    )
  }

  // Mock Data

  const inCart = cstore.carts.some(c => c.productId === product.id)
  const mrp = Math.floor(product.price * 1.4)
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const rating = 4.5
  const ratingCount = 1245
  const deliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  })



  return (
    <div className="page product-details-page">
      <SEO
        title={product.title}
        description={product.about}
        image={product.images[0]}
        type="product"
      />
      <div className="breadcrumb">
        <Link to="/catalog">Catalog</Link> <span>›</span> <span className="active">{product.title}</span>
      </div>

      <div className="details-grid-amazon">
        {/* Left Column: Images */}
        <div className="col-images">
          <div className="main-image-container">
            <img src={mainImage.length > 0 ? mainImage : product.images[0] || '/assets/images/full_logo.png'} alt={product.title} />
            <div className='mt-3'>
              {product.images.map((img, index) => (
                <img className='m-1' key={index} src={img} alt={`${product.title} ${index + 1}`} width={60} height={60} onClick={() => setMainImage(img)} />
              ))}
            </div>
          </div>
        </div>

        {/* Center Column: Info */}
        <div className="col-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-meta">
            <div className="rating-row">
              <span className="stars">★★★★☆</span>
              <span className="arrow-down"></span>
              <Link to="#reviews" className="rating-count">{ratingCount.toLocaleString()} ratings</Link>
            </div>
          </div>

          <div className="divider"></div>

          <div className="price-section">
            <div className="price-row-lg">
              <span className="discount-lg">-{discount}%</span>
              <span className="currency-lg">₹</span>
              <span className="price-lg">{product.price.toLocaleString()}</span>
            </div>
            <div className="delivery">
              <span className="free">FREE delivery</span>
              <span className="date">{deliveryDate}</span>
            </div>
            <div className="mrp-row">
              M.R.P.: <span className="strike">₹{mrp.toLocaleString()}</span>
            </div>
            <div className="taxes-note">Inclusive of all taxes</div>
          </div>

          <div className="divider"></div>



          <div className="divider"></div>

          <div className="about-item">
            <h3>About this item</h3>
            <ul>
              <li>{product.about}</li>
              <li>High quality material ensuring durability and comfort.</li>
              <li>Perfect for daily use or special occasions.</li>
              <li>Easy to clean and maintain.</li>
            </ul>
          </div>
          <div className="qty-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label>Quantity:</label>
            <div className="qty-control" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
              <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                style={{ padding: '5px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderRight: '1px solid #ddd' }}
              >
                -
              </button>
              <span style={{ padding: '5px 15px', minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
              <button
                onClick={() => setQty(q => q + 1)}
                style={{ padding: '5px 10px', background: '#f0f0f0', border: 'none', cursor: 'pointer', borderLeft: '1px solid #ddd' }}
              >
                +
              </button>
            </div>
          </div>
          {product.stock <= 0 ? (
            <span className="out-of-stock">Out of stock</span>
          ) : (
            <div className='row'>
              {inCart ?
                (<Link to="/cart" className='col-md-6'><h5> Added to cart</h5></Link>) : (
                  <div className='col-md-6'>
                    <button
                      className="btn-amazon-primary" style={{ width: '100%', margin: '0', marginBottom: '10px' }}
                      onClick={async () => {
                        await addToCart(product.id, qty)
                      }}
                    >
                      Add to Cart
                    </button></div>)}
              <div className='col-md-6'>
                <button className="btn-amazon-secondary" style={{ width: '100%', margin: '0' }} onClick={async () => {
                  if (!inCart) {
                    await addToCart(product.id, qty);
                  }
                  navigate('/cart')
                }}>Buy Now</button></div>
            </div>)}
          <div className="wishlist-row">
            <button
              className="btn-link-sm"
              onClick={async () => {
                if (product) {
                  if (wished) {
                    await removeFromWishlistByProduct(product.id)
                  } else {
                    await addToWishlist(product.id)
                  }
                }
              }}
            >
              {wished ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>

      </div>

      <div className="divider-section"></div>

      {/* Reviews Section */}
      <div className="reviews-container" id="reviews">
        <div className="reviews-left">
          <h2>Customer reviews</h2>
          <div className="rating-summary">
            <div className="stars-lg">★★★★☆</div>
            <span>{rating} out of 5</span>
          </div>
          <div className="global-ratings">{ratingCount.toLocaleString()} global ratings</div>

          <div className="rating-bars">
            {[5, 4, 3, 2, 1].map((star, i) => (
              <div className="bar-row" key={star}>
                <span>{star} star</span>
                <div className="bar-bg"><div className="bar-fill" style={{ width: `${[60, 20, 10, 5, 5][i]}%` }}></div></div>
                <span>{[60, 20, 10, 5, 5][i]}%</span>
              </div>
            ))}
          </div>

          <div className="review-cta">
            <h3>Review this product</h3>
            <p>Share your thoughts with other customers</p>
            <button className="btn-write-review">Write a product review</button>
          </div>
        </div>

        <div className="reviews-right">
          <h3>Top reviews from India</h3>
          {reviews.slice(0, 5).map(review => (
            <div className="review-card" key={review.id}>
              <div className='d-flex justify-content-between'>

                <div className="review-user">
                  <div className="user-avatar"></div>
                  <span>{review.user}<div className="verified-badge">Verified Purchase</div></span>
                </div>
                <div className="review-date">Reviewed in India on {review.date}</div>
              </div>
              <div className="review-rating-row">
                <span className="stars">{Array(review.rating).fill('★').join('')}{Array(5 - review.rating).fill('☆').join('')}</span>
                <span className="review-title">{review.title}</span>
              </div>


              <div className="review-content">{review.content}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
