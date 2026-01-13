import { ProductModel } from "./ProductModel";

export class CartModel {
    id: number;
    productId: number;
    customerId: number;
    qty: number;
    createdAt: Date;
    product?: ProductModel;

    constructor({
        id,
        productId,
        customerId,
        qty,
        createdAt,
        product,
    }: {
        id: number;
        productId: number;
        customerId: number;
        qty: number;
        createdAt: Date;
        product?: ProductModel;
    }) {
        this.id = id;
        this.productId = productId;
        this.customerId = customerId;
        this.qty = qty;
        this.createdAt = createdAt;
        this.product = product;
    }

    static fromMap(json: any): CartModel {
        return new CartModel({
            id: json.id,
            productId: json.product_id,
            customerId: json.customer_id,
            qty: json.qty,
            createdAt: new Date(json.created_at),
            product: json.products ? ProductModel.fromMap(json.products) : undefined,
        });
    }
}
