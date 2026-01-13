import CheckoutModal from '../components/CheckoutModal'

import { useNavigate } from 'react-router-dom';

export default function Checkout() {
  const navigate = useNavigate();
  return (
    <section>
      <h2>Checkout</h2>
      <CheckoutModal onClose={() => { navigate('/cart') }} />
    </section>
  )
}
