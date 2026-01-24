export const CouponType = {
    fixed: "fixed",
    percentage: "percentage"
} as const;

export type CouponType = typeof CouponType[keyof typeof CouponType];