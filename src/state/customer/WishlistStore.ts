import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { WishlistModel } from "../../data/model/WishlistModel";
import { Status } from "../../core/enum/Status";
import { WishlistDatasource } from "../../data/datasource/WishlistDatasource";
import { WishlistPayload } from "../../data/payload/WishlistPayload";
import { showError, showSuccess } from "../../core/message";
import useCustomerAuthStore from "./CustomerAuthStore";

const wishlistDatasource = new WishlistDatasource();

interface WishlistState {
    // State
    wishlists: WishlistModel[];
    status: Status;

    // Actions
    loadWishlists: () => Promise<void>;
    addToWishlist: (productVariantId: number) => Promise<void>;
    removeFromWishlist: (wishlistId: number) => Promise<void>;
    removeFromWishlistByProduct: (productVariantId: number) => Promise<void>;
    clearWishlist: () => Promise<void>; // Note: Usually clearing wishlist one by one, but can implement bulk delete if API supports
}

const WishlistStore: StateCreator<WishlistState> = (set, get) => ({
    wishlists: [],
    status: Status.init,

    loadWishlists: async () => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            set({ wishlists: [] });
            return;
        }

        set({ status: Status.loading });
        try {
            const wishlists = await wishlistDatasource.listWishlists(customer.id);
            set({ wishlists, status: Status.success });
        } catch (error) {
            console.error(error);
            set({ status: Status.error });
        }
    },

    addToWishlist: async (productVariantId: number) => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            showError("Please login to add items to wishlist");
            return;
        }

        // Check if already in wishlist
        const existing = get().wishlists.find(w => w.productVariantId === productVariantId);
        if (existing) {
            showSuccess("Already in wishlist");
            return;
        }

        set({ status: Status.loading });
        try {
            const payload = new WishlistPayload({
                productVariantId,
                customerId: customer.id,
            });

            await wishlistDatasource.addWishlist(payload);
            showSuccess("Added to wishlist");

            // Reload wishlists to get fresh data
            await get().loadWishlists();
        } catch (error) {
            console.error(error);
            showError("Failed to add to wishlist");
            set({ status: Status.error });
        }
    },

    removeFromWishlist: async (wishlistId: number) => {
        set({ status: Status.loading });
        try {
            await wishlistDatasource.deleteWishlist(wishlistId);
            showSuccess("Removed from wishlist");

            // Optimistic update
            const currentWishlists = get().wishlists;
            set({
                wishlists: currentWishlists.filter(w => w.id !== wishlistId),
                status: Status.success
            });
        } catch (error) {
            console.error(error);
            showError("Failed to remove from wishlist");
            set({ status: Status.error });
        }
    },

    removeFromWishlistByProduct: async (productVariantId: number) => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) return;

        set({ status: Status.loading });
        try {
            await wishlistDatasource.deleteWishlistByProduct(customer.id, productVariantId);
            showSuccess("Removed from wishlist");

            // Reload or optimistic update
            const currentWishlists = get().wishlists;
            set({
                wishlists: currentWishlists.filter(w => w.productVariantId !== productVariantId),
                status: Status.success
            });

        } catch (error) {
            console.error(error);
            showError("Failed to remove from wishlist");
            set({ status: Status.error });
        }
    },

    clearWishlist: async () => {
        // This is a placeholder as usually wishlist isn't cleared all at once like cart
        // But if needed, we would need a bulk delete endpoint or loop through ids
        console.warn("clearWishlist not fully implemented");
    }
});

const useWishlistStore = create<WishlistState>()(
    devtools(
        WishlistStore,
        { name: "wishlist-store" }
    )
);

export default useWishlistStore;
