import { ProductModel } from "./ProductModel";

export class OrderItemModel {
    id: number;
    createdAt: Date;
    orderId: number;
    productId: number;
    qty: number;
    product?: ProductModel;

    constructor({
        id,
        createdAt,
        orderId,
        productId,
        qty,
        product,
    }: {
        id: number;
        createdAt: Date;
        orderId: number;
        productId: number;
        qty: number;
        product?: ProductModel;
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.orderId = orderId;
        this.productId = productId;
        this.qty = qty;
        this.product = product;
    }

    static fromMap(json: any): OrderItemModel {
        return new OrderItemModel({
            id: json.id,
            createdAt: new Date(json.created_at),
            orderId: json.order_id,
            productId: json.product_id,
            qty: json.qty,
            product: json.products ? ProductModel.fromMap(json.products) : undefined,
        });
    }
}
