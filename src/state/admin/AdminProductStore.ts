import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Status } from "../../core/enum/Status";
import { ProductDatasource } from "../../data/datasource/ProductDatasource";
import { ProductModel } from "../../data/model/ProductModel";
import { CategoryModel } from "../../data/model/CategoryModel";
import { ProductPayload } from "../../data/payload/ProductPayload";
import { CategoryPayload } from "../../data/payload/CategoryPayload";
import { showError, showSuccess } from "../../core/message";

const productDatasource = new ProductDatasource();

interface AdminProductState {
    // State
    initStatus: Status,
    categorySubmitStatus: Status;
    productSubmitStatus: Status;
    products: ProductModel[];
    categories: CategoryModel[];
    categoryName: string;
    categoryImage: string;
    productTitle: string;
    productAbout: string;
    productPrice: number;
    productCategoryIds: number[];
    productVariants: {
        id?: number;
        color: string;
        colorHex: string;
        price: number;
        stock: number;
        images: string;
    }[];

    // Actions
    init: () => Promise<void>;
    // Product Actions
    addProduct: () => Promise<void>;
    updateProduct: (id: number) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    // Category Actions
    addCategory: () => Promise<void>;
    updateCategory: (id: number) => Promise<void>;
    deleteCategory: (id: number) => Promise<void>;

    setCategoryName: (name: string) => Promise<void>,
    setCategoryImage: (image: string) => Promise<void>,
    setProductTitle: (title: string) => Promise<void>,
    setProductAbout: (about: string) => Promise<void>,
    setProductPrice: (price: number) => Promise<void>,
    toggleProductCategoryId: (id: number) => Promise<void>,
    addProductVariant: () => Promise<void>,
    removeProductVariant: (index: number) => Promise<void>,
    updateProductVariant: (index: number, field: string, value: any) => Promise<void>,
    setProductVariants: (variants: any[]) => Promise<void>,
    setProductCategoryIds: (ids: number[]) => Promise<void>,
}

const AdminProductStore: StateCreator<AdminProductState> = (set, get) => ({
    initStatus: Status.init,
    categorySubmitStatus: Status.init,
    productSubmitStatus: Status.init,
    products: [],
    categories: [],
    categoryName: "",
    categoryImage: "",
    productTitle: "",
    productAbout: "",
    productPrice: 0,
    productCategoryIds: [],
    productVariants: [],

    setCategoryName: async (name: string) => set({ categoryName: name }),
    setCategoryImage: async (image: string) => set({ categoryImage: image }),
    setProductTitle: async (title: string) => set({ productTitle: title }),
    setProductAbout: async (about: string) => set({ productAbout: about }),
    setProductPrice: async (price: number) => set({ productPrice: price }),
    toggleProductCategoryId: async (id: number) => {
        const currentIds = get().productCategoryIds;
        if (currentIds.includes(id)) {
            set({ productCategoryIds: currentIds.filter(c => c !== id) });
        } else {
            set({ productCategoryIds: [...currentIds, id] });
        }
    },
    setProductCategoryIds: async (ids: number[]) => set({ productCategoryIds: ids }),
    addProductVariant: async () => {
        set({
            productVariants: [
                ...get().productVariants,
                { id: undefined, color: "", colorHex: "#000000", price: 0, stock: 0, images: "" }
            ]
        });
    },
    removeProductVariant: async (index: number) => {
        const variants = [...get().productVariants];
        variants.splice(index, 1);
        set({ productVariants: variants });
    },
    updateProductVariant: async (index: number, field: string, value: any) => {
        const variants = [...get().productVariants];
        variants[index] = { ...variants[index], [field]: value };
        set({ productVariants: variants });
    },
    setProductVariants: async (variants: any[]) => set({ productVariants: variants }),

    init: async () => {
        set({ initStatus: Status.loading });
        try {
            const [products, categories] = await Promise.all([
                productDatasource.listProducts(),
                productDatasource.listCategories()
            ]);
            set({ products: products, categories: categories, initStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to load products and categories");
            set({ initStatus: Status.error });
        }
    },

    // --- Product Actions ---

    addProduct: async () => {
        const variants = get().productVariants.map(v => ({
            color: v.color,
            color_hex: v.colorHex,
            price: v.price,
            stock: v.stock,
            images: v.images.split(',').map(s => s.trim()).filter(s => s !== "")
        }));

        const payload: ProductPayload = new ProductPayload({
            title: get().productTitle,
            about: get().productAbout,
            basePrice: get().productPrice,
            categoryIds: get().productCategoryIds,
            variants: variants,
        });
        set({ productSubmitStatus: Status.loading });
        try {
            await productDatasource.addProduct(payload);
            showSuccess("Product added successfully");
            // Refresh list
            const products = await productDatasource.listProducts();
            set({
                products: products,
                productSubmitStatus: Status.success,
                // Reset form
                productTitle: "",
                productAbout: "",
                productPrice: 0,
                productCategoryIds: [],
                productVariants: []
            });
        } catch (error) {
            console.error(error);
            showError("Failed to add product");
            set({ productSubmitStatus: Status.error });
        }
    },

    updateProduct: async (id: number) => {
        const variants = get().productVariants.map(v => ({
            id: v.id,
            color: v.color,
            color_hex: v.colorHex,
            price: v.price,
            stock: v.stock,
            images: v.images.split(',').map(s => s.trim()).filter(s => s !== "")
        }));

        const payload: ProductPayload = new ProductPayload({
            title: get().productTitle,
            about: get().productAbout,
            basePrice: get().productPrice,
            categoryIds: get().productCategoryIds,
            variants: variants,
        });
        set({ productSubmitStatus: Status.loading });
        try {
            await productDatasource.updateProduct(id, payload);
            showSuccess("Product updated successfully");
            const products = await productDatasource.listProducts();
            set({ products, productSubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to update product");
            set({ productSubmitStatus: Status.error });
        }
    },

    deleteProduct: async (id: number) => {
        set({ productSubmitStatus: Status.loading });
        try {
            await productDatasource.deleteProduct(id);
            showSuccess("Product deleted successfully");
            // Optimistic update or refresh? Refresh is safer.
            const products = await productDatasource.listProducts();
            set({ products, productSubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to delete product");
            set({ productSubmitStatus: Status.error });
        }
    },

    // --- Category Actions ---

    addCategory: async () => {
        const payload: CategoryPayload = new CategoryPayload({
            name: get().categoryName,
            image: get().categoryImage,
        });
        set({ categorySubmitStatus: Status.loading });
        try {
            await productDatasource.addCategory(payload);
            showSuccess("Category added successfully");
            const categories = await productDatasource.listCategories();
            set({ categories: categories, categorySubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to add category");
            set({ categorySubmitStatus: Status.error });
        }
    },

    updateCategory: async (id: number) => {
        const payload: CategoryPayload = new CategoryPayload({
            name: get().categoryName,
            image: get().categoryImage,
        });
        set({ categorySubmitStatus: Status.loading });
        try {
            await productDatasource.updateCategory(id, payload);
            showSuccess("Category updated successfully");
            const categories = await productDatasource.listCategories();
            set({ categories: categories, categorySubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to update category");
            set({ categorySubmitStatus: Status.error });
        }
    },

    deleteCategory: async (id: number) => {
        set({ categorySubmitStatus: Status.loading });
        try {
            await productDatasource.deleteCategory(id);
            showSuccess("Category deleted successfully");
            const categories = await productDatasource.listCategories();
            set({ categories: categories, categorySubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to delete category");
            set({ categorySubmitStatus: Status.error });
        }
    },
});

const useAdminProductStore = create<AdminProductState>()(
    devtools(
        AdminProductStore,
        { name: "admin-product-store" }
    )
);

export default useAdminProductStore;
