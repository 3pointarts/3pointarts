import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

export default function About() {
  const showcaseImages = [
    '/assets/images/about/1.jpeg',
    '/assets/images/about/2.jpeg',
    '/assets/images/about/3.jpeg',
    '/assets/images/about/4.jpeg',
    '/assets/images/about/5.jpeg',
    '/assets/images/about/6.jpeg',
    '/assets/images/about/7.jpeg',
    '/assets/images/about/8.jpeg',
  ];

  return (
    <div className="page about-page">
      <SEO
        title="About Us"
        description="Learn more about 3 Point Arts, our passion for 3D printing, and our mission to create unique, custom-made 3D printed lamps, statues, and models."
      />

      <div className="container py-5">
        {/* Header Section */}
        <div className="text-center mb-5">
          <h1 className="fw-bold display-4">About 3 Point Arts</h1>
          <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Turning imagination into reality through the art of 3D printing. We craft unique lamps, intricate statues, and custom models with passion and precision.
          </p>
        </div>

        {/* Vision Section */}
        <div className="row align-items-center mb-5 g-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-3">Our Vision</h2>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              At 3 Point Arts, we envision a world where art meets technology. We believe that 3D printing is not just about manufacturing, but about bringing creative ideas to life. Our goal is to provide high-quality, custom-made 3D printed products that add a touch of uniqueness to your home and life. Whether it's a personalized lamp to light up your room or a detailed model car for your collection, we strive for perfection in every layer we print.
            </p>
            <p className="text-muted" style={{ lineHeight: '1.8' }}>
              Innovation is at our core. We constantly explore new materials, techniques, and designs to push the boundaries of what's possible with 3D printing.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="bg-light rounded p-4 text-center shadow-sm">
              <i className="fa fa-lightbulb-o fa-5x text-warning mb-3"></i>
              <h3>Creativity & Innovation</h3>
              <p className="text-muted">Where ideas take shape.</p>
            </div>
          </div>
        </div>
        {/* Showcase Grid */}
        <div className="mb-5">
          <h2 className="text-center fw-bold mb-4">Our Work</h2>
          <div className="row g-3">
            {showcaseImages.map((src, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="ratio ratio-1x1 overflow-hidden rounded shadow-sm">
                  <img
                    src={src}
                    alt={`Showcase ${index + 1}`}
                    className="img-fluid object-fit-cover w-100 h-100"
                    style={{ transition: 'transform 0.3s' }}
                    onError={(e) => {
                      // Fallback if image doesn't exist
                      e.currentTarget.src = 'https://placehold.co/400x400?text=3Point+Arts';
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Journey Timeline */}
        <div className="mb-5">
          <h2 className="text-center fw-bold mb-4">Our Journey</h2>
          <div className="timeline position-relative">
            <div className="border-start position-absolute start-50 translate-middle-x h-100 d-none d-md-block" style={{ borderLeftStyle: 'dashed' }}></div>
            <div className="row g-4">
              <div className="col-md-6 text-md-end">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">2010</span>
                    <h5 className="card-title">The Beginning</h5>
                    <p className="card-text small text-muted">Started as a small hobby project in a garage, experimenting with the first generation of 3D printers.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 offset-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">2015</span>
                    <h5 className="card-title">First Studio</h5>
                    <p className="card-text small text-muted">Opened our first dedicated design studio and started taking custom commissions for local clients.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 text-md-end">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">2020</span>
                    <h5 className="card-title">Expanding Horizons</h5>
                    <p className="card-text small text-muted">Launched our online store and expanded our product line to include home decor and complex mechanical models.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 offset-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <span className="badge bg-primary mb-2">Present</span>
                    <h5 className="card-title">3 Point Arts Today</h5>
                    <p className="card-text small text-muted">A leading name in custom 3D printed art, serving customers worldwide with a diverse range of products.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Contact Section */}
        <div className="text-center bg-light p-5 rounded">
          <h2 className="fw-bold mb-3">Get in Touch</h2>
          <p className="text-muted mb-4">Have a custom idea or a question? We'd love to hear from you.</p>
          <div>

            <a href="mailto:support@3pointarts.com" className="btn btn-outline-dark">
              <i className="fa fa-envelope-o me-2"></i> support@3pointarts.com
            </a>
          </div>
          <div className="btn btn-primary mx-auto mt-3" style={{ width: "max-content" }} >
            <Link to="/contact"  >
              Contact Us Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
