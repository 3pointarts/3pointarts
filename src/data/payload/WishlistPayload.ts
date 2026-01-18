export class WishlistPayload {
    productVariantId: number;
    customerId: number;

    constructor({
        productVariantId,
        customerId,
    }: {
        productVariantId: number;
        customerId: number;
    }) {
        this.productVariantId = productVariantId;
        this.customerId = customerId;
    }

    toMap(): any {
        return {
            product_variant_id: this.productVariantId,
            customer_id: this.customerId,
        };
    }
}
