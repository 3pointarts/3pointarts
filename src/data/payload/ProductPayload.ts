export class ProductPayload {
    title: string;
    about: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: number;

    constructor({
        title,
        about,
        price,
        stock,
        images,
        categoryId,
    }: {
        title: string;
        about: string;
        price: number;
        stock: number;
        images: string[];
        categoryId: number;
    }) {
        this.title = title;
        this.about = about;
        this.price = price;
        this.stock = stock;
        this.images = images;
        this.categoryId = categoryId;
    }

    toMap(): any {
        return {
            title: this.title,
            about: this.about,
            price: this.price,
            stock: this.stock,
            images: this.images.join(','),
            category_id: this.categoryId,
        };
    }
}
