export class CartPayload {
    productId: number;
    customerId: number;
    qty: number;

    constructor({
        productId,
        customerId,
        qty,
    }: {
        productId: number;
        customerId: number;
        qty: number;
    }) {
        this.productId = productId;
        this.customerId = customerId;
        this.qty = qty;
    }

    toMap(): any {
        return {
            product_id: this.productId,
            customer_id: this.customerId,
            qty: this.qty,
        };
    }
}
