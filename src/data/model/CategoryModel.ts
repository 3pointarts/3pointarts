export class CategoryModel {
    id: number;
    name: string;
    image: string;
    createdAt: Date;

    constructor({ id, name, image, createdAt }: { id: number; name: string; image: string; createdAt: Date }) {
        this.id = id;
        this.name = name;
        this.image = image;
        this.createdAt = createdAt;
    }

    static fromMap(json: any): CategoryModel {
        return new CategoryModel({
            id: json.id,
            name: json.name,
            image: json.image,
            createdAt: new Date(json.created_at),
        });
    }
}
