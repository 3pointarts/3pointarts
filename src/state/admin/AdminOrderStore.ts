import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Status } from "../../core/enum/Status";
import { OrderDatasource } from "../../data/datasource/OrderDatasource";
import { OrderModel } from "../../data/model/OrderModel";
import { OrderStatus } from "../../core/enum/OrderStatus";
import { showError, showSuccess } from "../../core/message";

const orderDatasource = new OrderDatasource();

interface AdminOrderState {
    // State
    initStatus: Status;
    getOrderStatus: Status;
    updateStatus: Status;
    selectedOrder: OrderModel | null;
    newOrders: OrderModel[];
    buildingOrders: OrderModel[];
    shippedOrders: OrderModel[];
    completedOrders: OrderModel[];

    // Actions
    init: () => Promise<void>;
    updateOrderStatus: (id: number, status: OrderStatus) => Promise<void>;
    getOrderById: (id: number) => Promise<void>;
}

const AdminOrderStore: StateCreator<AdminOrderState> = (set, get) => ({
    initStatus: Status.init,
    updateStatus: Status.init,
    getOrderStatus: Status.init,
    newOrders: [],
    buildingOrders: [],
    shippedOrders: [],
    completedOrders: [],
    selectedOrder: null,

    init: async () => {
        set({ initStatus: Status.loading });
        try {
            const [newOrders, buildingOrders, shippedOrders, completedOrders] = await Promise.all([
                orderDatasource.listOrdersByStatus(OrderStatus.new),
                orderDatasource.listOrdersByStatus(OrderStatus.building),
                orderDatasource.listOrdersByStatus(OrderStatus.shipped),
                orderDatasource.listOrdersByStatus(OrderStatus.delivered),
            ]);
            set({
                newOrders,
                buildingOrders,
                shippedOrders,
                completedOrders,
                initStatus: Status.success
            });
        } catch (error) {
            console.error(error);
            showError("Failed to load orders");
            set({ initStatus: Status.error });
        }
    },

    updateOrderStatus: async (id: number, status: OrderStatus) => {
        set({ updateStatus: Status.loading });
        try {
            await orderDatasource.updateOrderStatus(id, status);
            showSuccess(`Order status updated to ${status}`);

            // Reload all orders to reflect changes
            await get().init();
            set({ updateStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to update order status");
            set({ updateStatus: Status.error });
        }
    },

    getOrderById: async (id: number) => {
        set({ getOrderStatus: Status.loading, selectedOrder: null });
        try {
            const order = await orderDatasource.getOrderById(id);
            if (order) {
                set({ selectedOrder: order, getOrderStatus: Status.success });
            } else {
                showError("Order not found");
                set({ getOrderStatus: Status.error });
            }
        } catch (error) {
            console.error(error);
            showError("Failed to load order details");
            set({ getOrderStatus: Status.error });
        }
    },
});

const useAdminOrderStore = create<AdminOrderState>()(
    devtools(
        AdminOrderStore,
        { name: "admin-order-store" }
    )
);

export default useAdminOrderStore;
