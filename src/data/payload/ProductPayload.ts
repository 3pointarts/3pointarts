export class ProductPayload {
    title: string;
    about: string;
    basePrice: number;

    constructor({
        title,
        about,
        basePrice,
    }: {
        title: string;
        about: string;
        basePrice: number;
    }) {
        this.title = title;
        this.about = about;
        this.basePrice = basePrice;
    }

    toMap(): any {
        return {
            title: this.title,
            about: this.about,
            base_price: this.basePrice,
        };
    }
}
