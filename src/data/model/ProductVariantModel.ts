import { ProductModel } from "./ProductModel";

export class ProductVariantModel {
    id: number;
    color: string;
    images: string[];
    price: number;
    stock: number;
    colorHex: string;
    createdAt: Date;
    productId: number;
    product?: ProductModel;

    constructor({
        id,
        color,
        images,
        price,
        stock,
        colorHex,
        createdAt,
        productId,
        product,
    }: {
        id: number;
        color: string;
        images: string[];
        price: number;
        stock: number;
        colorHex: string;
        createdAt: Date;
        productId: number;
        product?: ProductModel;
    }) {
        this.id = id;
        this.color = color;
        this.images = images;
        this.price = price;
        this.stock = stock;
        this.colorHex = colorHex;
        this.createdAt = createdAt;
        this.productId = productId;
        this.product = product;
    }

    static fromMap(json: any): ProductVariantModel {
        return new ProductVariantModel({
            id: json.id,
            color: json.color,
            images: (json.images ?? "").split(","),
            price: json.price,
            stock: json.stock,
            colorHex: json.color_hex,
            createdAt: new Date(json.created_at),
            productId: json.product_id,
            product: json.products ? ProductModel.fromMap(json.products) : undefined,
        });
    }
}
