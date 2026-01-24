import { http } from "../../core/http/HttpClient";
import { CouponModel } from "../model/CouponModel";
import { CouponPayload } from "../payload/CouponPayload";

const BASE_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/coupon";

export class CouponDatasource {
    async listCoupons(): Promise<CouponModel[]> {
        const res = await http<any[]>(`${BASE_URL}?select=*&order=created_at.desc`);
        return res.map((item) => CouponModel.fromMap(item));
    }

    async addCoupon(payload: CouponPayload): Promise<CouponModel[]> {
        return http<CouponModel[]>(BASE_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async updateCoupon(id: number, payload: CouponPayload): Promise<CouponModel[]> {
        return http<CouponModel[]>(`${BASE_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async deleteCoupon(id: number): Promise<void> {
        await http(`${BASE_URL}?id=eq.${id}`, {
            method: "DELETE",
        });
    }
}
