import { ProductVariantModel } from "./ProductVariantModel";

export class OrderItemModel {
    id: number;
    createdAt: Date;
    orderId: number;
    productVariantId: number;
    qty: number;
    productVariant?: ProductVariantModel;

    constructor({
        id,
        createdAt,
        orderId,
        productVariantId,
        qty,
        productVariant,
    }: {
        id: number;
        createdAt: Date;
        orderId: number;
        productVariantId: number;
        qty: number;
        productVariant?: ProductVariantModel;
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.orderId = orderId;
        this.productVariantId = productVariantId;
        this.qty = qty;
        this.productVariant = productVariant;
    }

    static fromMap(json: any): OrderItemModel {
        return new OrderItemModel({
            id: json.id,
            createdAt: new Date(json.created_at),
            orderId: json.order_id,
            productVariantId: json.product_variant_id,
            qty: json.qty,
            productVariant: json.product_variants ? ProductVariantModel.fromMap(json.product_variants) : undefined,
        });
    }
}
