import { ProductVariantModel } from "./ProductVariantModel";

export class CartModel {
    id: number;
    productVariantId: number;
    customerId: number;
    qty: number;
    createdAt: Date;
    productVariant?: ProductVariantModel;

    constructor({
        id,
        productVariantId,
        customerId,
        qty,
        createdAt,
        productVariant,
    }: {
        id: number;
        productVariantId: number;
        customerId: number;
        qty: number;
        createdAt: Date;
        productVariant?: ProductVariantModel;
    }) {
        this.id = id;
        this.productVariantId = productVariantId;
        this.customerId = customerId;
        this.qty = qty;
        this.createdAt = createdAt;
        this.productVariant = productVariant;
    }

    static fromMap(json: any): CartModel {
        return new CartModel({
            id: json.id,
            productVariantId: json.product_variant_id,
            customerId: json.customer_id,
            qty: json.qty,
            createdAt: new Date(json.created_at),
            productVariant: json.product_variants ? ProductVariantModel.fromMap(json.product_variants) : undefined,
        });
    }
}
