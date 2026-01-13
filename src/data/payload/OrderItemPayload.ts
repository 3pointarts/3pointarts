export class OrderItemPayload {
    productId: number;
    qty: number;

    constructor({
        productId,
        qty,
    }: {
        productId: number;
        qty: number;
    }) {
        this.productId = productId;
        this.qty = qty;
    }

    toMap(orderId: number): any {
        return {
            order_id: orderId,
            product_id: this.productId,
            qty: this.qty,
        };
    }
}
