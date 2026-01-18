import { ProductVariantModel } from "./ProductVariantModel";
import { ProductCategoryModel } from "./ProductCategoryModel";

export class ProductModel {
    id: number;
    title: string;
    about: string;
    basePrice: number;
    productVariants: ProductVariantModel[];
    productCategories: ProductCategoryModel[];
    createdAt: Date;

    constructor({
        id,
        title,
        about,
        basePrice,
        productVariants,
        productCategories,
        createdAt,
    }: {
        id: number;
        title: string;
        about: string;
        basePrice: number;
        productVariants: ProductVariantModel[];
        productCategories: ProductCategoryModel[];
        createdAt: Date;
    }) {
        this.id = id;
        this.title = title;
        this.about = about;
        this.basePrice = basePrice;
        this.productVariants = productVariants;
        this.productCategories = productCategories;
        this.createdAt = createdAt;
    }

    static fromMap(json: any): ProductModel {
        return new ProductModel({
            id: json.id,
            title: json.title,
            about: json.about,
            basePrice: json.base_price,
            productVariants: Array.isArray(json.product_variants) ? json.product_variants.map((v: any) => ProductVariantModel.fromMap(v)) : [],
            productCategories: Array.isArray(json.product_categories) ? json.product_categories.map((c: any) => ProductCategoryModel.fromMap(c)) : [],
            createdAt: new Date(json.created_at),
        });
    }
}
