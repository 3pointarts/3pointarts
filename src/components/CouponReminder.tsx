import { useNavigate } from "react-router-dom";
import { CouponCondition } from "../core/enum/CouponCondition";
import { CouponType } from "../core/enum/CouponType";
import useCartStore from "../state/customer/CartStore"

export default function CouponReminder() {
    const navigate = useNavigate();

    const cartStore = useCartStore();

    return (
        cartStore.eligibleCoupons.length > 0 ?
            <div className="coupon-reminder">
                <div className="coupon-reminder-header">
                    {cartStore.eligibleCoupons[0].value}{cartStore.eligibleCoupons[0].type === CouponType.percentage ? '%' : ' Rs'} OFF {cartStore.eligibleCoupons[0].condition && ("on Buying at least" + (cartStore.eligibleCoupons[0].condition == CouponCondition.min_product_qty ? ' ' + cartStore.eligibleCoupons[0].conditionValue + ' items' : ' ' + cartStore.eligibleCoupons[0].conditionValue + ' Rs worth of products'))}
                </div>
                {cartStore.eligibleCoupons[0].condition && (cartStore.eligibleCoupons[0].condition == CouponCondition.min_product_qty ?
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>

                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'start', margin: '10px 0', width: '80%', paddingLeft: '10px' }}>
                            {Array.from({ length: cartStore.eligibleCoupons[0].conditionValue ?? 0 }, (_, i) => i).map((_, index) => (
                                cartStore.carts.length <= index ?
                                    <div
                                        key={index}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            border: '4px solid #ffa600ff',
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffa600ff',
                                            fontSize: '18px'
                                        }}
                                    >
                                        <i className="fa fa-plus" aria-hidden="true"></i>
                                    </div>
                                    :
                                    <div
                                        key={index}
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '50%',
                                            border: '4px solid #ffa600ff',
                                            backgroundColor: 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#ffa600ff',
                                            fontSize: '18px',
                                            position: 'relative'
                                        }}
                                    >
                                        <img src={cartStore.carts[index].productVariant?.images?.[0] || '/assets/images/full_logo.png'} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} alt="" />
                                        <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '0px 5px', fontSize: '12px' }}>
                                            {cartStore.carts[index].qty}
                                        </div>
                                    </div>
                            ))}
                        </div>
                        {
                            cartStore.carts.length >= (cartStore.eligibleCoupons[0].conditionValue ?? 0) ?
                                <div
                                    onClick={() => {
                                        cartStore.applyCoupon(cartStore.eligibleCoupons[0].code)
                                        navigate('/cart')
                                    }}
                                    style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', margin: '10px', width: '20%', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#ffa600ff', color: '#fff', padding: '5px', borderRadius: '5px' }}>
                                    Apply
                                </div>
                                :
                                <div
                                    onClick={() => navigate('/cart')}
                                    style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', margin: '10px', width: '20%', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#ffa600ff', color: '#fff', padding: '5px', borderRadius: '5px' }}>
                                    Cart
                                </div>
                        }
                        {/* <div style={{ display: 'flex', gap: '8px', justifyContent: 'end', margin: '10px', width: '20%', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#ffa600ff', color: '#fff', padding: '5px', borderRadius: '5px' }}>
                            Place Order
                        </div> */}
                    </div>
                    :
                    <div>
                        {cartStore.eligibleCoupons[0].conditionValue} Rs
                    </div>
                )}
            </div>
            :
            <></>
    )
}