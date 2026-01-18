export class CartPayload {
    productVariantId: number;
    customerId: number;
    qty: number;

    constructor({
        productVariantId,
        customerId,
        qty,
    }: {
        productVariantId: number;
        customerId: number;
        qty: number;
    }) {
        this.productVariantId = productVariantId;
        this.customerId = customerId;
        this.qty = qty;
    }

    toMap(): any {
        return {
            product_variant_id: this.productVariantId,
            customer_id: this.customerId,
            qty: this.qty,
        };
    }
}
