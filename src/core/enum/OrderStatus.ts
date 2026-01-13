export const OrderStatus = {
    new: "new",
    building: "building",
    shipped: "shipped",
    delivered: "delivered"
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];