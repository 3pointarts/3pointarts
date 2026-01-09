import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const slides = [
  { id: 1, image: '/assets/images/b1.png', link: '/catalog' },
  { id: 2, image: '/assets/images/b2.png', link: '/catalog?category=Statue' },
  { id: 3, image: '/assets/images/b3.png', link: '/catalog?category=Lamp' },
]

export default function HomeCarousel() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="home-carousel">
      {slides.map((slide, index) => (
        <Link
          to={slide.link}
          key={slide.id}
          className={`carousel-slide ${index === current ? 'active' : ''}`}
        >
          <img src={slide.image} alt={`Slide ${slide.id}`} />
        </Link>
      ))}
      
      <button 
        className="carousel-prev" 
        onClick={() => setCurrent((curr) => (curr === 0 ? slides.length - 1 : curr - 1))}
      >
        &#10094;
      </button>
      
      <button 
        className="carousel-next" 
        onClick={() => setCurrent((curr) => (curr + 1) % slides.length)}
      >
        &#10095;
      </button>

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  )
}
