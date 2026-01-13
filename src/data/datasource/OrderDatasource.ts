import { http } from "../../core/http/HttpClient";
import { OrderModel } from "../model/OrderModel";
import { OrderStatus } from "../../core/enum/OrderStatus";
import type { OrderPayload } from "../payload/OrderPayload";

const ORDER_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/orders";
const ORDER_ITEM_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/order_items";

export class OrderDatasource {

    async addOrderWithItems(payload: OrderPayload): Promise<OrderModel> {
        // 1. Create Order
        const orderRes = await http<any[]>(ORDER_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });

        const orderData = orderRes[0];
        const orderId = orderData.id;

        // 2. Create Order Items
        if (payload.items && payload.items.length > 0) {
            const itemsData = payload.items.map(item => item.toMap(orderId));
            await http(ORDER_ITEM_URL, {
                method: "POST",
                headers: {
                    Prefer: "return=representation",
                },
                body: JSON.stringify(itemsData),
            });
        }

        // Return the order model (without items populated for now, or we could fetch them)
        return OrderModel.fromMap(orderData);
    }

    async listCustomerOrders(customerId: number): Promise<OrderModel[]> {
        const res = await http<any[]>(`${ORDER_URL}?customer_id=eq.${customerId}&select=*,order_items(*,products(*))&order=created_at.desc`);
        return res.map((item) => OrderModel.fromMap(item));
    }

    async listOrdersByStatus(status: OrderStatus): Promise<OrderModel[]> {
        const res = await http<any[]>(`${ORDER_URL}?status=eq.${status}&select=*,order_items(*,products(*)),users(*)&order=created_at.desc`);
        return res.map((item) => OrderModel.fromMap(item));
    }

    async updateOrderStatus(id: number, status: OrderStatus): Promise<void> {
        await http(`${ORDER_URL}?id=eq.${id}`, {
            method: "PATCH",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify({ status }),
        });
    }

    async getOrderById(id: number): Promise<OrderModel | null> {
        const res = await http<any[]>(`${ORDER_URL}?id=eq.${id}&select=*,order_items(*,products(*)),users(*)`);
        if (res && res.length > 0) {
            return OrderModel.fromMap(res[0]);
        }
        return null;
    }
}
