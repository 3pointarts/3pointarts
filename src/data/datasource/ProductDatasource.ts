import { http } from "../../core/http/HttpClient";
import { ProductModel } from "../model/ProductModel";
import { CategoryModel } from "../model/CategoryModel";
import type { ProductPayload } from "../payload/ProductPayload";
import type { CategoryPayload } from "../payload/CategoryPayload";

const PRODUCT_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/products";
const CATEGORY_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/categories";
const PRODUCT_VARIANTS_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/product_variants";
const PRODUCT_CATEGORIES_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/product_categories";

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
        const { category_ids, variants, ...productData } = payload.toMap();

        // 1. Create Product
        const products = await http<any[]>(PRODUCT_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(productData),
        });

        if (!products || products.length === 0) {
            throw new Error("Failed to create product");
        }
        const productId = products[0].id;

        // 2. Add Categories
        if (category_ids && category_ids.length > 0) {
            const categoryInserts = category_ids.map((catId: number) => ({
                product_id: productId,
                category_id: catId
            }));
            await http(PRODUCT_CATEGORIES_URL, {
                method: "POST",
                body: JSON.stringify(categoryInserts),
            });
        }

        // 3. Add Variants
        if (variants && variants.length > 0) {
            const variantInserts = variants.map((v: any) => ({
                ...v,
                product_id: productId,
                images: v.images.join(',')
            }));
            await http(PRODUCT_VARIANTS_URL, {
                method: "POST",
                body: JSON.stringify(variantInserts),
            });
        }

        return products.map(p => ProductModel.fromMap(p));
    }

    async updateProduct(id: number, payload: ProductPayload): Promise<ProductModel[]> {
        const { category_ids, variants, ...productData } = payload.toMap();

        // 1. Update Product
        const products = await http<any[]>(`${PRODUCT_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(productData),
        });

        // 2. Update Categories (Delete all and re-insert)
        // Delete existing
        await http(`${PRODUCT_CATEGORIES_URL}?product_id=eq.${id}`, {
            method: "DELETE",
        });
        // Insert new
        if (category_ids && category_ids.length > 0) {
            const categoryInserts = category_ids.map((catId: number) => ({
                product_id: id,
                category_id: catId
            }));
            await http(PRODUCT_CATEGORIES_URL, {
                method: "POST",
                body: JSON.stringify(categoryInserts),
            });
        }

        // 3. Update Variants (Upsert logic to avoid FK constraints)
        // Get existing variants
        const existingVariants = await http<any[]>(`${PRODUCT_VARIANTS_URL}?product_id=eq.${id}&select=id`);
        const existingVariantIds = existingVariants.map(v => v.id);

        const variantsToUpdate = [];
        const variantsToInsert = [];
        const incomingVariantIds: number[] = [];

        if (variants && variants.length > 0) {
            for (const v of variants) {
                if (v.id) {
                    variantsToUpdate.push({
                        ...v,
                        product_id: id,
                        images: v.images.join(',')
                    });
                    incomingVariantIds.push(v.id);
                } else {
                    variantsToInsert.push({
                        ...v,
                        product_id: id,
                        images: v.images.join(',')
                    });
                }
            }
        }

        // Identify variants to delete
        const variantsToDelete = existingVariantIds.filter(vid => !incomingVariantIds.includes(vid));

        // Execute Updates
        for (const v of variantsToUpdate) {
            await http(`${PRODUCT_VARIANTS_URL}?id=eq.${v.id}`, {
                method: "PATCH",
                body: JSON.stringify(v),
            });
        }

        // Execute Inserts
        if (variantsToInsert.length > 0) {
            await http(PRODUCT_VARIANTS_URL, {
                method: "POST",
                body: JSON.stringify(variantsToInsert),
            });
        }

        // Execute Deletes (This might still fail if referenced, but at least we don't delete valid ones)
        if (variantsToDelete.length > 0) {
            // We can try to delete them. If it fails, we log it but don't crash the whole update?
            // Or better, we let it crash so the user knows they can't delete that variant?
            // The user wants to "fix" the issue. The issue was crashing on *valid* updates.
            // If the user *removed* a variant that is in a cart, it is correct to crash (or warn).
            // But if we just let it crash, the valid updates (above) might have already happened?
            // Ideally we do this transactionally, but with REST calls we can't easily.
            // We'll proceed with delete.
            const idsToDelete = variantsToDelete.join(',');
            await http(`${PRODUCT_VARIANTS_URL}?id=in.(${idsToDelete})`, {
                method: "DELETE",
            });
        }

        return products.map(p => ProductModel.fromMap(p));
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
