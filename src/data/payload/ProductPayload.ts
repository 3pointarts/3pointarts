export interface ProductVariantPayload {
    id?: number;
    color: string;
    color_hex: string;
    price: number;
    stock: number;
    images: string[];
}

export class ProductPayload {
    title: string;
    about: string;
    basePrice: number;
    categoryIds: number[];
    variants: ProductVariantPayload[];

    constructor({
        title,
        about,
        basePrice,
        categoryIds,
        variants,
    }: {
        title: string;
        about: string;
        basePrice: number;
        categoryIds: number[];
        variants: ProductVariantPayload[];
    }) {
        this.title = title;
        this.about = about;
        this.basePrice = basePrice;
        this.categoryIds = categoryIds;
        this.variants = variants;
    }

    toMap(): any {
        return {
            title: this.title,
            about: this.about,
            base_price: this.basePrice,
            category_ids: this.categoryIds,
            variants: this.variants.map(v => ({
                id: v.id,
                color: v.color,
                color_hex: v.color_hex,
                price: v.price,
                stock: v.stock,
                images: v.images,
            })),
        };
    }
}
