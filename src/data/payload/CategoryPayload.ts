export class CategoryPayload {
    name: string;
    image: string;

    constructor({ name, image }: { name: string; image: string }) {
        this.name = name;
        this.image = image;
    }

    toMap(): any {
        return {
            name: this.name,
            image: this.image,
        };
    }
}
