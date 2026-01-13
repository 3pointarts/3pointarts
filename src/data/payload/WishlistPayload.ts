export class WishlistPayload {
    productId: number;
    customerId: number;

    constructor({
        productId,
        customerId,
    }: {
        productId: number;
        customerId: number;
    }) {
        this.productId = productId;
        this.customerId = customerId;
    }

    toMap(): any {
        return {
            product_id: this.productId,
            customer_id: this.customerId,
        };
    }
}
