import { ProductModel } from "./ProductModel";

export class WishlistModel {
    id: number;
    productId: number;
    customerId: number;
    createdAt: Date;
    product?: ProductModel;

    constructor({
        id,
        productId,
        customerId,
        createdAt,
        product,
    }: {
        id: number;
        productId: number;
        customerId: number;
        createdAt: Date;
        product?: ProductModel;
    }) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.createdAt = createdAt;
        this.product = product;
    }

    static fromMap(json: any): WishlistModel {
        return new WishlistModel({
            id: json.id,
            productId: json.product_id,
            customerId: json.customer_id,
            createdAt: new Date(json.created_at),
            product: json.products ? ProductModel.fromMap(json.products) : undefined,
        });
    }
}
