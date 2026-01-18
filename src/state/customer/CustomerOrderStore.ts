import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { OrderModel } from "../../data/model/OrderModel";
import { Status } from "../../core/enum/Status";
import { OrderDatasource } from "../../data/datasource/OrderDatasource";
import { OrderPayload } from "../../data/payload/OrderPayload";
import { OrderItemPayload } from "../../data/payload/OrderItemPayload";
import { showError, showSuccess } from "../../core/message";
import useCustomerAuthStore from "./CustomerAuthStore";
import useCartStore from "./CartStore";
import { OrderStatus } from "../../core/enum/OrderStatus";
import { ProductDatasource } from "../../data/datasource/ProductDatasource";
import { ProductPayload } from "../../data/payload/ProductPayload";

const orderDatasource = new OrderDatasource();
const productDatasource = new ProductDatasource();

interface CustomerOrderState {
    // State
    orders: OrderModel[];
    status: Status;
    createStatus: Status;

    // Order Form State
    contactName: string;
    contactPhone: string;
    contactAddress: string;
    billTo: string;
    note: string;

    // Actions
    setContactName: (name: string) => void;
    setContactPhone: (phone: string) => void;
    setContactAddress: (address: string) => void;
    setBillTo: (billTo: string) => void;
    setNote: (note: string) => void;

    loadOrders: () => Promise<void>;
    createOrder: () => Promise<boolean>;
    resetForm: () => void;
}

const CustomerOrderStore: StateCreator<CustomerOrderState> = (set, get) => ({
    orders: [],
    status: Status.init,
    createStatus: Status.init,

    contactName: "",
    contactPhone: "",
    contactAddress: "",
    billTo: "",
    note: "",

    setContactName: (contactName: string) => set({ contactName }),
    setContactPhone: (contactPhone: string) => set({ contactPhone }),
    setContactAddress: (contactAddress: string) => set({ contactAddress }),
    setBillTo: (billTo: string) => set({ billTo }),
    setNote: (note: string) => set({ note }),

    resetForm: () => set({
        contactName: "",
        contactPhone: "",
        contactAddress: "",
        billTo: "",
        note: "",
        createStatus: Status.init
    }),

    loadOrders: async () => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            set({ orders: [] });
            return;
        }

        set({ status: Status.loading });
        try {
            const orders = await orderDatasource.listCustomerOrders(customer.id);
            set({ orders, status: Status.success });
        } catch (error) {
            console.error(error);
            set({ status: Status.error });
        }
    },

    createOrder: async () => {
        const { contactName, contactPhone, contactAddress, billTo, note } = get();
        const customer = useCustomerAuthStore.getState().customer;
        const { carts, clearCart } = useCartStore.getState();

        if (!customer) {
            showError("Please login to place an order");
            return false;
        }

        if (carts.length === 0) {
            showError("Your cart is empty");
            return false;
        }

        if (!contactName || !contactPhone || !contactAddress || !billTo) {
            showError("Please fill in all required fields");
            return false;
        }

        set({ createStatus: Status.loading });

        try {
            // Calculate total
            const total = carts.reduce((sum, item) => {
                const price = item.productVariant?.price ?? 0;
                return sum + (price * item.qty);
            }, 0);

            // Create payload items
            const orderItems = carts.map(item => new OrderItemPayload({
                productVariantId: item.productVariantId,
                qty: item.qty
            }));

            const payload = new OrderPayload({
                customerId: customer.id,
                contactName,
                contactPhone,
                contactAddress,
                billTo,
                note,
                total,
                status: OrderStatus.new,
                items: orderItems
            });

            await orderDatasource.addOrderWithItems(payload);

            // Reduce stock
            /*
            try {
                // TODO: Implement variant stock reduction
                // const products = await productDatasource.listProducts();
                // for (const item of carts) {
                //     const product = products.find(p => p.id === item.productVariantId);
                //     ...
                // }
            } catch (error) {
                console.error("Failed to update stock", error);
            }
            */

            showSuccess("Order placed successfully!");
            set({ createStatus: Status.success });

            // Clear cart and reload orders
            await clearCart();
            await get().loadOrders();
            get().resetForm();
            return true;
        } catch (error) {
            console.error(error);
            showError("Failed to place order");
            set({ createStatus: Status.error });
            return false;
        }
    }
});

const useCustomerOrderStore = create<CustomerOrderState>()(
    devtools(
        CustomerOrderStore,
        { name: "customer-order-store" }
    )
);

export default useCustomerOrderStore;
