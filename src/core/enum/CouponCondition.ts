export const CouponCondition = {
    min_order_value: "min_order_value",
    min_product_qty: "min_product_qty"
} as const;

export type CouponCondition = typeof CouponCondition[keyof typeof CouponCondition];
