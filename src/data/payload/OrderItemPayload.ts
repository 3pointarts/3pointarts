export class OrderItemPayload {
    productVariantId: number;
    qty: number;

    constructor({
        productVariantId,
        qty,
    }: {
        productVariantId: number;
        qty: number;
    }) {
        this.productVariantId = productVariantId;
        this.qty = qty;
    }

    toMap(orderId: number): any {
        return {
            order_id: orderId,
            product_variant_id: this.productVariantId,
            qty: this.qty,
        };
    }
}
