import { http } from "../../core/http/HttpClient";
import { ProductModel } from "../model/ProductModel";
import { CategoryModel } from "../model/CategoryModel";
import type { ProductPayload } from "../payload/ProductPayload";
import type { CategoryPayload } from "../payload/CategoryPayload";

const PRODUCT_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/products";
const CATEGORY_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/categories";

export class ProductDatasource {
    // --- Category Methods ---

    async addCategory(payload: CategoryPayload): Promise<CategoryModel[]> {
        return http<CategoryModel[]>(CATEGORY_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async updateCategory(id: number, payload: CategoryPayload): Promise<CategoryModel[]> {
        return http<CategoryModel[]>(`${CATEGORY_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async deleteCategory(id: number): Promise<void> {
        await http(`${CATEGORY_URL}?id=eq.${id}`, {
            method: "DELETE",
        });
    }

    async listCategories(): Promise<CategoryModel[]> {
        const res = await http<any[]>(`${CATEGORY_URL}?select=*&order=created_at.desc`);
        return res.map((item) => CategoryModel.fromMap(item));
    }

    // --- Product Methods ---

    async addProduct(payload: ProductPayload): Promise<ProductModel[]> {
        return http<ProductModel[]>(PRODUCT_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async updateProduct(id: number, payload: ProductPayload): Promise<ProductModel[]> {
        return http<ProductModel[]>(`${PRODUCT_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async deleteProduct(id: number): Promise<void> {
        await http(`${PRODUCT_URL}?id=eq.${id}`, {
            method: "DELETE",
        });
    }

    async listProducts(): Promise<ProductModel[]> {
        const res = await http<any[]>(`${PRODUCT_URL}?select=*,product_variants(*),product_categories(categories(*))&order=created_at.desc`);
        return res.map((item) => ProductModel.fromMap(item));
    }
}
