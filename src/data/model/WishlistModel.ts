import { ProductVariantModel } from "./ProductVariantModel";

export class WishlistModel {
    id: number;
    productVariantId: number;
    customerId: number;
    createdAt: Date;
    productVariant?: ProductVariantModel;

    constructor({
        id,
        productVariantId,
        customerId,
        createdAt,
        productVariant,
    }: {
        id: number;
        productVariantId: number;
        customerId: number;
        createdAt: Date;
        productVariant?: ProductVariantModel;
    }) {
        this.id = id;
        this.productVariantId = productVariantId;
        this.customerId = customerId;
        this.createdAt = createdAt;
        this.productVariant = productVariant;
    }

    static fromMap(json: any): WishlistModel {
        return new WishlistModel({
            id: json.id,
            productVariantId: json.product_variant_id,
            customerId: json.customer_id,
            createdAt: new Date(json.created_at),
            productVariant: json.product_variants ? ProductVariantModel.fromMap(json.product_variants) : undefined,
        });
    }
}
