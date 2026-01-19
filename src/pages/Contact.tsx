import { SEO } from '../components/SEO';

export default function Contact() {
  return (
    <div className="page contact-page">
      <SEO
        title="Contact Us"
        description="Get in touch with 3 Point Arts for custom orders, support, or inquiries about our 3D printed products."
      />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Contact Us</h1>
        </div>

        <div className="row g-5">
          {/* Phone Section */}
          <div className="col-md-4 text-center">
            <div className="contact-icon mb-3">
              <i className="fa fa-phone" style={{ fontSize: '3rem', color: '#fd7e14' }}></i>
            </div>
            <h5 className="text-uppercase fw-bold mb-3">By Phone</h5>
            <p className="text-muted small mb-1">(Monday to Friday, 9am to 6pm IST)</p>
            <a href="tel:+918393852069" className="btn btn-outline-dark px-4 py-2 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              Start Call
            </a>
          </div>

          {/* Email Section */}
          <div className="col-md-4 text-center">
            <div className="contact-icon mb-3">
              <i className="fa fa-envelope-o" style={{ fontSize: '3rem', color: '#fd7e14' }}></i>
            </div>
            <h5 className="text-uppercase fw-bold mb-3">Start a New Case</h5>
            <p className="text-muted mb-4">
              Just send us your questions or concerns by starting a new case and we will give you the help you need.
            </p>
            <p className=" mb-4">
              Mail : 3pointarts@gmail.com
            </p>
            <a href="mailto:3pointarts@gmail.com" className="btn btn-outline-dark px-4 py-2 text-uppercase" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>
              Start Here
            </a>
          </div>

          {/* WhatsApp Section */}
          <div className="col-md-4 text-center">
            <div className="contact-icon mb-3">
              <i className="fa fa-whatsapp" style={{ fontSize: '3rem', color: '#fd7e14' }}></i>
            </div>
            <h5 className="text-uppercase fw-bold mb-3">Live Chat</h5>
            <p className="text-muted mb-4">
              Chat with a member of our in-house team.
            </p>
            <a
              href="https://wa.me/918393852069"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-dark px-4 py-2 text-uppercase"
              style={{ fontSize: '0.9rem', letterSpacing: '1px' }}
            >
              Start Chat
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
