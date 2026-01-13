import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { CartModel } from "../../data/model/CartModel";
import { Status } from "../../core/enum/Status";
import { CartDatasource } from "../../data/datasource/CartDatasource";
import { CartPayload } from "../../data/payload/CartPayload";
import { showError, showSuccess } from "../../core/message";
import useCustomerAuthStore from "./CustomerAuthStore";

const cartDatasource = new CartDatasource();

interface CartState {
    // State
    carts: CartModel[];
    status: Status;

    // Actions
    loadCarts: () => Promise<void>;
    addToCart: (productId: number, qty: number) => Promise<void>;
    updateCartQty: (cartId: number, productId: number, qty: number) => Promise<void>;
    removeFromCart: (cartId: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartStore: StateCreator<CartState> = (set, get) => ({
    carts: [],
    status: Status.init,

    loadCarts: async () => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            set({ carts: [] });
            return;
        }

        set({ status: Status.loading });
        try {
            const carts = await cartDatasource.listCarts(customer.id);
            set({ carts, status: Status.success });
        } catch (error) {
            console.error(error);
            set({ status: Status.error });
        }
    },

    addToCart: async (productId: number, qty: number) => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            showError("Please login to add items to cart");
            return;
        }

        set({ status: Status.loading });
        try {
            const payload = new CartPayload({
                productId,
                customerId: customer.id,
                qty
            });
            
            const existingCartItem = get().carts.find(c => c.productId === productId);
            
            if (existingCartItem) {
                // Update existing
                const newQty = existingCartItem.qty + qty;
                 const updatePayload = new CartPayload({
                    productId,
                    customerId: customer.id,
                    qty: newQty
                });
                await cartDatasource.updateCart(existingCartItem.id, updatePayload);
                showSuccess("Cart updated");
            } else {
                // Add new
                await cartDatasource.addCart(payload);
                showSuccess("Added to cart");
            }
            
            // Reload carts to get fresh data
            await get().loadCarts();
        } catch (error) {
            console.error(error);
            showError("Failed to add to cart");
            set({ status: Status.error });
        }
    },

    updateCartQty: async (cartId: number, productId: number, qty: number) => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) return;

        // Optimistic update
        const originalCarts = get().carts;
        const updatedCarts = originalCarts.map(c => 
            c.id === cartId ? { ...c, qty } as CartModel : c
        );
        set({ carts: updatedCarts });

        try {
            const payload = new CartPayload({
                productId,
                customerId: customer.id,
                qty
            });
            await cartDatasource.updateCart(cartId, payload);
        } catch (error) {
            console.error(error);
            showError("Failed to update cart");
            set({ carts: originalCarts }); // Revert on failure
        }
    },

    removeFromCart: async (cartId: number) => {
        set({ status: Status.loading });
        try {
            await cartDatasource.deleteCarts([cartId]);
            showSuccess("Removed from cart");
            
            // Optimistic update or reload
            const currentCarts = get().carts;
            set({ 
                carts: currentCarts.filter(c => c.id !== cartId),
                status: Status.success 
            });
        } catch (error) {
            console.error(error);
            showError("Failed to remove from cart");
            set({ status: Status.error });
        }
    },

    clearCart: async () => {
        const { carts } = get();
        if (carts.length === 0) return;

        set({ status: Status.loading });
        try {
            const ids = carts.map(c => c.id);
            await cartDatasource.deleteCarts(ids);
            showSuccess("Cart cleared");
            set({ carts: [], status: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to clear cart");
            set({ status: Status.error });
        }
    }
});

const useCartStore = create<CartState>()(
    devtools(
        CartStore,
        { name: "cart-store" }
    )
);

export default useCartStore;
