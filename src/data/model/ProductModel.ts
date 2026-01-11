import { CategoryModel } from "./CategoryModel";

export class ProductModel {
    id: number;
    title: string;
    about: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: number;
    category?: CategoryModel;
    createdAt: Date;

    constructor({
        id,
        title,
        about,
        price,
        stock,
        images,
        categoryId,
        category,
        createdAt,
    }: {
        id: number;
        title: string;
        about: string;
        price: number;
        stock: number;
        images: string[];
        categoryId: number;
        category?: CategoryModel;
        createdAt: Date;
    }) {
        this.id = id;
        this.title = title;
        this.about = about;
        this.price = price;
        this.stock = stock;
        this.images = images;
        this.categoryId = categoryId;
        this.category = category;
        this.createdAt = createdAt;
    }

    static fromMap(json: any): ProductModel {
        return new ProductModel({
            id: json.id,
            title: json.title,
            about: json.about,
            price: json.price,
            stock: json.stock,
            images: typeof json.images === 'string' ? json.images.split(',') : (Array.isArray(json.images) ? json.images : []),
            categoryId: json.category_id,
            category: json.categories ? CategoryModel.fromMap(json.categories) : undefined,
            createdAt: new Date(json.created_at),
        });
    }
}
