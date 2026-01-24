import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { CartModel } from "../../data/model/CartModel";
import { Status } from "../../core/enum/Status";
import { CartDatasource } from "../../data/datasource/CartDatasource";
import { CouponDatasource } from "../../data/datasource/CouponDatasource";
import { CartPayload } from "../../data/payload/CartPayload";
import { showError, showSuccess } from "../../core/message";
import useCustomerAuthStore from "./CustomerAuthStore";
import { ProductVariantModel } from "../../data/model/ProductVariantModel";
import { CouponModel } from "../../data/model/CouponModel";
import { CouponCondition } from "../../core/enum/CouponCondition";

const cartDatasource = new CartDatasource();
const couponDatasource = new CouponDatasource();
const LOCAL_CART_KEY = "local_cart";

interface CartState {
    // State
    carts: CartModel[];
    status: Status;
    eligibleCoupons: CouponModel[];
    appliedCoupon: CouponModel | null;
    couponStatus: Status;

    // Actions
    loadCarts: () => Promise<void>;
    addToCart: (productId: number, qty: number, variant?: ProductVariantModel) => Promise<void>;
    updateCartQty: (cartId: number, productId: number, qty: number) => Promise<void>;
    removeFromCart: (cartId: number) => Promise<void>;
    clearCart: () => Promise<void>;
    listCoupons: () => Promise<void>;
    applyCoupon: (code: string) => void;
    removeCoupon: () => void;
}

const CartStore: StateCreator<CartState> = (set, get) => ({
    carts: [],
    status: Status.init,
    eligibleCoupons: [],
    appliedCoupon: null,
    couponStatus: Status.init,

    loadCarts: async () => {
        const customer = useCustomerAuthStore.getState().customer;
        get().listCoupons();
        if (!customer) {
            const localCartJson = localStorage.getItem(LOCAL_CART_KEY);
            if (localCartJson) {
                try {
                    const localCarts = JSON.parse(localCartJson).map((item: any) => CartModel.fromMap(item));
                    set({ carts: localCarts, status: Status.success });
                } catch (e) {
                    console.error("Failed to parse local cart", e);
                    set({ carts: [] });
                }
            } else {
                set({ carts: [] });
            }
            return;
        }

        set({ status: Status.loading });
        try {
            const carts = await cartDatasource.listCarts(customer.id);
            set({ carts, status: Status.success });
            window.scrollTo(0, 0);
        } catch (error) {
            console.error(error);
            set({ status: Status.error });
        }

    },

    addToCart: async (productVariantId: number, qty: number, variant?: ProductVariantModel) => {
        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            const { carts } = get();
            const existingCartItem = carts.find(c => c.productVariantId === productVariantId);
            let newCarts = [...carts];

            if (existingCartItem) {
                existingCartItem.qty += qty;
                newCarts = carts.map(c => c.productVariantId === productVariantId ? existingCartItem : c);
                showSuccess("Cart updated");
            } else {
                if (!variant) {
                    showError("Product information missing");
                    return;
                }
                const newItem = new CartModel({
                    id: Date.now(),
                    productVariantId,
                    customerId: 0,
                    qty,
                    createdAt: new Date(),
                    productVariant: variant
                });
                newCarts.push(newItem);
                showSuccess("Added to cart");
            }

            const serializedCarts = newCarts.map(c => ({
                id: c.id,
                product_variant_id: c.productVariantId,
                customer_id: c.customerId,
                qty: c.qty,
                created_at: c.createdAt.toISOString(),
                product_variants: c.productVariant ? {
                    id: c.productVariant.id,
                    color: c.productVariant.color,
                    images: c.productVariant.images.join(','),
                    price: c.productVariant.price,
                    stock: c.productVariant.stock,
                    color_hex: c.productVariant.colorHex,
                    created_at: c.productVariant.createdAt.toISOString(),
                    product_id: c.productVariant.productId,
                    products: c.productVariant.product ? {
                        id: c.productVariant.product.id,
                        title: c.productVariant.product.title,
                        about: c.productVariant.product.about,
                        base_price: c.productVariant.product.basePrice,
                        created_at: c.productVariant.product.createdAt.toISOString(),
                    } : undefined
                } : undefined
            }));

            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(serializedCarts));
            set({ carts: newCarts });
            return;
        }

        set({ status: Status.loading });
        try {
            const payload = new CartPayload({
                productVariantId,
                customerId: customer.id,
                qty
            });

            const existingCartItem = get().carts.find(c => c.productVariantId === productVariantId);

            if (existingCartItem) {
                // Update existing
                const newQty = existingCartItem.qty + qty;
                const updatePayload = new CartPayload({
                    productVariantId,
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

    updateCartQty: async (cartId: number, productVariantId: number, qty: number) => {
        const customer = useCustomerAuthStore.getState().customer;

        if (!customer) {
            const { carts } = get();
            const updatedCarts = carts.map(c =>
                c.id === cartId ? { ...c, qty } as CartModel : c
            );
            set({ carts: updatedCarts });
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(serializeCarts(updatedCarts)));
            return;
        }

        // Optimistic update
        const originalCarts = get().carts;
        const updatedCarts = originalCarts.map(c =>
            c.id === cartId ? { ...c, qty } as CartModel : c
        );
        set({ carts: updatedCarts });

        try {
            const payload = new CartPayload({
                productVariantId,
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
        const customer = useCustomerAuthStore.getState().customer;

        if (!customer) {
            const { carts } = get();
            const newCarts = carts.filter(c => c.id !== cartId);
            set({ carts: newCarts });
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(serializeCarts(newCarts)));
            showSuccess("Removed from cart");
            return;
        }

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

        const customer = useCustomerAuthStore.getState().customer;
        if (!customer) {
            set({ carts: [], status: Status.success });
            localStorage.removeItem(LOCAL_CART_KEY);
            showSuccess("Cart cleared");
            return;
        }

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
    },

    listCoupons: async () => {
        set({ couponStatus: Status.loading });
        try {
            const coupons = await couponDatasource.listCoupons();
            // Filter active coupons
            const now = new Date();
            const activeCoupons = coupons.filter(c =>
                c.active &&
                (!c.endDate || new Date(c.endDate) > now)
            );
            set({ eligibleCoupons: activeCoupons, couponStatus: Status.success });
        } catch (error) {
            console.error("Failed to list coupons", error);
            set({ couponStatus: Status.error });
        }
    },

    applyCoupon: (code: string) => {
        const { eligibleCoupons, carts } = get();
        const coupon = eligibleCoupons.find(c => c.code === code);

        if (!coupon) {
            showError("Invalid Coupon Code");
            return;
        }

        const totalAmount = carts.reduce((sum, item) => sum + (item.productVariant?.price ?? 0) * item.qty, 0);
        const totalQty = carts.reduce((sum, item) => sum + item.qty, 0);

        if (coupon.condition === CouponCondition.min_order_value) {
            if (totalAmount < (coupon.conditionValue ?? 0)) {
                showError(`Minimum order value of ₹${coupon.conditionValue} required`);
                return;
            }
        } else if (coupon.condition === CouponCondition.min_product_qty) {
            if (totalQty < (coupon.conditionValue ?? 0)) {
                showError(`Minimum product quantity of ${coupon.conditionValue} required`);
                return;
            }
        }

        set({ appliedCoupon: coupon });
        showSuccess(`Coupon ${code} applied!`);
    },

    removeCoupon: () => {
        set({ appliedCoupon: null });
        showSuccess("Coupon removed");
    }
});

const serializeCarts = (carts: CartModel[]) => {
    return carts.map(c => ({
        id: c.id,
        product_variant_id: c.productVariantId,
        customer_id: c.customerId,
        qty: c.qty,
        created_at: c.createdAt.toISOString(),
        product_variants: c.productVariant ? {
            id: c.productVariant.id,
            color: c.productVariant.color,
            images: c.productVariant.images,
            price: c.productVariant.price,
            stock: c.productVariant.stock,
            color_hex: c.productVariant.colorHex,
            created_at: c.productVariant.createdAt.toISOString(),
            product_id: c.productVariant.productId,
            products: c.productVariant.product ? {
                id: c.productVariant.product.id,
                title: c.productVariant.product.title,
                about: c.productVariant.product.about,
                base_price: c.productVariant.product.basePrice,
                created_at: c.productVariant.product.createdAt.toISOString(),
                product_categories: c.productVariant.product.productCategories?.map(pc => ({
                    categories: {
                        id: pc.categories.id,
                        name: pc.categories.name,
                        image: pc.categories.image,
                        created_at: pc.categories.createdAt.toISOString()
                    }
                }))
            } : undefined
        } : undefined
    }));
};

const useCartStore = create<CartState>()(
    devtools(
        CartStore,
        { name: "cart-store" }
    )
);

export default useCartStore;
