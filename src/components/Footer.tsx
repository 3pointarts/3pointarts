import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-auto">
      <div className="container">
        <div className="row">
          {/* Brand & Contact */}
          <div className="col-lg-4 col-md-6 mb-4">
            <img
              src="/assets/images/full_logo_bg.png"
              alt="3 Point Arts"
              height={50}
              className="mb-3 bg-white rounded p-1"
              style={{ objectFit: 'contain' }}
            />
            <p className="small text-white-50 mb-3">
              Your premier destination for custom 3D printed art, models, and lamps. Bringing your imagination to reality with precision and passion.
            </p>
            <div className="d-flex flex-column gap-2">
              <a href="mailto:support@3pointarts.com" className="text-light text-decoration-none small">
                <i className="fa fa-envelope me-2 text-warning"></i> support@3pointarts.com
              </a>
              <a href="https://wa.me/918393852069" target="_blank" rel="noreferrer" className="text-light text-decoration-none small">
                <i className="fa fa-whatsapp me-2 text-warning"></i> +91 83938 52069
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-warning h6">Quick Links</h5>
            <ul className="list-unstyled small">
              <li className="mb-2"><Link to="/about" className="text-light text-decoration-none">About Us</Link></li>
              <li className="mb-2"><Link to="/contact" className="text-light text-decoration-none">Contact Us</Link></li>
              <li className="mb-2"><Link to="/help" className="text-light text-decoration-none">FAQ & Help</Link></li>
              <li className="mb-2"><Link to="/catalog" className="text-light text-decoration-none">Catalog</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-warning h6">Follow Us</h5>
            <div className="d-flex gap-3 mb-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="btn btn-outline-light btn-sm rounded-circle" style={{ width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fa fa-youtube-play"></i>
              </a>
            </div>

            <h5 className="text-uppercase mb-2 fw-bold text-warning h6">Newsletter</h5>
            <div className="input-group input-group-sm">
              <input type="email" className="form-control bg-dark text-light border-secondary" placeholder="Your email" />
              <button className="btn btn-warning" type="button">Subscribe</button>
            </div>
          </div>

          {/* Partners */}
          <div className="col-lg-3 col-md-6 mb-4">
            <h5 className="text-uppercase mb-3 fw-bold text-warning h6">Our Partners</h5>
            <div className="bg-white rounded p-3">
              <div className="row g-2 align-items-center text-center">
                <div className="col-6">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="img-fluid" style={{ maxHeight: '25px' }} />
                </div>
                <div className="col-6">
                  <img src="/assets/images/FlipkartLogo.png" alt="Flipkart" className="img-fluid" style={{ maxHeight: '25px' }} />
                </div>

                <div className="col-12"><hr className="my-2" /></div>
                <div className="col-12 text-muted small fw-bold mb-1">Delivery Partners</div>
                <div className="col-6 bg-dark">
                  <img src="https://www.delhivery.com/_nuxt/img/Delhivery_logo.634bf46.webp" alt="Delhivery" className="img-fluid" style={{ maxHeight: '25px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary my-4" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="small text-white-50">© {new Date().getFullYear()} 3 Point Arts — 3D Print Studio. All rights reserved.</span>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <span className="text-white-50 small">Privacy Policy • Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
