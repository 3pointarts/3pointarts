import { http } from "../../core/http/HttpClient";
import { CartModel } from "../model/CartModel";
import type { CartPayload } from "../payload/CartPayload";

const CART_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/carts";

export class CartDatasource {

    async addCart(payload: CartPayload): Promise<CartModel[]> {
        return http<CartModel[]>(CART_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async updateCart(id: number, payload: CartPayload): Promise<CartModel[]> {
        return http<CartModel[]>(`${CART_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async deleteCarts(ids: number[]): Promise<void> {
        if (ids.length === 0) return;
        const idsString = ids.join(',');
        await http(`${CART_URL}?id=in.(${idsString})`, {
            method: "DELETE",
        });
    }

    async listCarts(userId: number): Promise<CartModel[]> {
        const res = await http<any[]>(`${CART_URL}?customer_id=eq.${userId}&select=*,products(*)&order=created_at.desc`);
        return res.map((item) => CartModel.fromMap(item));
    }
}
