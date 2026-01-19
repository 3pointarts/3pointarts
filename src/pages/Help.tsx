import { useState } from 'react';
import { SEO } from '../components/SEO';

export default function Help() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How to login?",
      answer: "Click on the 'Login' button in the top right corner. Enter your mobile number and click 'Send OTP'. Enter the OTP received on your phone to verify and log in safely."
    },
    {
      question: "How to place an order?",
      answer: "Browse our catalog and select a product. Choose your preferred variant (if available) and click 'Add to Cart'. Go to your cart, review items, and proceed to checkout. Enter your shipping address and complete the payment to place your order."
    },
    {
      question: "How to choose a color?",
      answer: "On the product details page, you will see color options under the 'Variants' section if available. Click on the color swatch or name to select your preferred variant before adding the item to your cart."
    },
    {
      question: "How to add items to wishlist?",
      answer: "Click the heart icon on any product card or the product details page. You must be logged in to save items to your wishlist for future reference."
    },
    {
      question: "How to track my order?",
      answer: "Go to your Profile by clicking your avatar in the top right and select 'My Orders'. Click on the specific order you want to track to see its current status (e.g., Processing, Shipped, Delivered)."
    },
    {
      question: "How to download my bill?",
      answer: "Navigate to 'My Orders' in your Profile. Find the order for which you need the bill. Click on the 'View Bill' or 'Invoice' button to view and download a copy of your receipt."
    }
  ];

  return (
    <div className="page help-page">
      <SEO
        title="Help Center"
        description="Find answers to common questions about ordering, account management, and more at 3 Point Arts."
      />

      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">Help Center</h1>
          <p className="text-muted">Frequently Asked Questions</p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div className="accordion-item mb-3 border rounded shadow-sm" key={index}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                      <button
                        className={`accordion-button ${!isOpen ? 'collapsed' : ''} fw-semibold`}
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen ? "true" : "false"}
                        aria-controls={`collapse${index}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={`collapse${index}`}
                      className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}
                      aria-labelledby={`heading${index}`}
                    >
                      <div className="accordion-body text-muted">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-5 mx-auto" style={{ width: "max-content" }}>
          <p>Still have questions?</p>
          <a href="/contact" className="btn btn-primary px-4 rounded-pill">Contact Support</a>
        </div>
      </div>
    </div>
  )
}
