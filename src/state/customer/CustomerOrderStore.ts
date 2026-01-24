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

import { AuthDatasource } from "../../data/datasource/AuthDatasource";
import { UserPayload } from "../../data/payload/UserPayload";
import { UserRole } from "../../core/enum/UserRole";

const orderDatasource = new OrderDatasource();
const authDatasource = new AuthDatasource();

interface CustomerOrderState {
    // State
    orders: OrderModel[];
    status: Status;
    createStatus: Status;

    // Guest / OTP State
    showOtpDialog: boolean;
    generatedOtp: string;
    pendingOrderProcessing: boolean;

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

    setShowOtpDialog: (show: boolean) => void;
    verifyOtpAndLogin: (inputOtp: string) => Promise<boolean>;
    checkGuestStatus: () => Promise<'otp_sent' | 'registered' | 'error' | 'missing_fields'>;

    loadOrders: () => Promise<void>;
    createOrder: () => Promise<boolean>;
    resetForm: () => void;
}

const CustomerOrderStore: StateCreator<CustomerOrderState> = (set, get) => ({
    orders: [],
    status: Status.init,
    createStatus: Status.init,

    showOtpDialog: false,
    generatedOtp: "",
    pendingOrderProcessing: false,

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

    setShowOtpDialog: (show: boolean) => set({ showOtpDialog: show }),

    resetForm: () => set({
        contactName: "",
        contactPhone: "",
        contactAddress: "",
        billTo: "",
        note: "",
        createStatus: Status.init,
        showOtpDialog: false,
        generatedOtp: "",
        pendingOrderProcessing: false
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

    checkGuestStatus: async () => {
        const { contactName, contactPhone, contactAddress, billTo } = get();
        if (!contactName || !contactPhone || !contactAddress || !billTo) {
            showError("Please fill in all required fields");
            return 'missing_fields';
        }

        set({ createStatus: Status.loading });
        try {
            // Send OTP regardless of user existence
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            await authDatasource.sendPhoneOtp(contactPhone, otp);

            set({
                generatedOtp: otp,
                showOtpDialog: true,
                pendingOrderProcessing: true,
                createStatus: Status.init
            });
            showSuccess("OTP sent to your phone");
            return 'otp_sent';
        } catch (error) {
            console.error(error);
            showError("Failed to process guest checkout");
            set({ createStatus: Status.error });
            return 'error';
        }
    },

    verifyOtpAndLogin: async (inputOtp: string) => {
        const { generatedOtp, contactPhone } = get();

        if (inputOtp !== generatedOtp) {
            showError("Invalid OTP");
            return false;
        }

        set({ showOtpDialog: false, pendingOrderProcessing: false });

        try {
            // Login the user
            const user = await authDatasource.customerLoginByPhone(contactPhone);
            if (user) {
                useCustomerAuthStore.getState().setCustomer(user);
                return true;
            } else {
                // Register new user if not found
                const { contactName } = get();
                const dummyEmail = `${contactPhone}@3pointarts.com`;
                const payload = new UserPayload(
                    contactName,
                    dummyEmail,
                    contactPhone,
                    UserRole.customer
                );

                const newUser = await authDatasource.customerRegister(payload);
                useCustomerAuthStore.getState().setCustomer(newUser);
                return true;
            }
        } catch (error) {
            console.error(error);
            showError("Failed to login");
            return false;
        }
    },

    createOrder: async () => {
        const { contactName, contactPhone, contactAddress, billTo, note } = get();
        const customer = useCustomerAuthStore.getState().customer;
        const { carts, clearCart } = useCartStore.getState();

        if (carts.length === 0) {
            showError("Your cart is empty");
            return false;
        }

        if (!customer) {
            showError("Authentication failed");
            set({ createStatus: Status.error });
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
