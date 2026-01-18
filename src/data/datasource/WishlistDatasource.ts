import { http } from "../../core/http/HttpClient";
import { WishlistModel } from "../model/WishlistModel";
import type { WishlistPayload } from "../payload/WishlistPayload";

const WISHLIST_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/wishlist";

export class WishlistDatasource {
    async addWishlist(payload: WishlistPayload): Promise<WishlistModel[]> {
        return http<WishlistModel[]>(WISHLIST_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async deleteWishlist(id: number): Promise<void> {
        await http(`${WISHLIST_URL}?id=eq.${id}`, {
            method: "DELETE",
        });
    }

    async deleteWishlistByProduct(customerId: number, productVariantId: number): Promise<void> {
        await http(`${WISHLIST_URL}?customer_id=eq.${customerId}&product_variant_id=eq.${productVariantId}`, {
            method: "DELETE",
        });
    }

    async listWishlists(customerId: number): Promise<WishlistModel[]> {
        const res = await http<any[]>(`${WISHLIST_URL}?customer_id=eq.${customerId}&select=*,users(*),product_variants(*,products(*,product_categories(categories(*))))&order=created_at.desc`);
        return res.map((item) => WishlistModel.fromMap(item));
    }
}
