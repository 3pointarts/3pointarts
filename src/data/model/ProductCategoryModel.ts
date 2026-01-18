import { CategoryModel } from "./CategoryModel";

export class ProductCategoryModel {
    categories: CategoryModel;

    constructor({ categories }: { categories: CategoryModel }) {
        this.categories = categories;
    }

    static fromMap(json: any): ProductCategoryModel {
        return new ProductCategoryModel({
            categories: CategoryModel.fromMap(json.categories)
        });
    }
}
