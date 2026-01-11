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
    productImage: string;
    productPrice: number;
    productStock: number;
    productCategoryId: number;

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
    setProductImage: (image: string) => Promise<void>,
    setProductPrice: (price: number) => Promise<void>,
    setProductStock: (stock: number) => Promise<void>,
    setProductCategoryId: (id: number) => Promise<void>,
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
    productImage: "",
    productPrice: 0,
    productStock: 0,
    productCategoryId: 0,

    setCategoryName: async (name: string) => set({ categoryName: name }),
    setCategoryImage: async (image: string) => set({ categoryImage: image }),
    setProductTitle: async (title: string) => set({ productTitle: title }),
    setProductAbout: async (about: string) => set({ productAbout: about }),
    setProductImage: async (image: string) => set({ productImage: image }),
    setProductPrice: async (price: number) => set({ productPrice: price }),
    setProductStock: async (stock: number) => set({ productStock: stock }),
    setProductCategoryId: async (id: number) => set({ productCategoryId: id }),

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
        const payload: ProductPayload = new ProductPayload({
            title: get().productTitle,
            about: get().productAbout,
            images: get().productImage.split(','),
            price: get().productPrice,
            stock: get().productStock,
            categoryId: get().productCategoryId,
        });
        set({ productSubmitStatus: Status.loading });
        try {
            await productDatasource.addProduct(payload);
            showSuccess("Product added successfully");
            // Refresh list
            const products = await productDatasource.listProducts();
            set({ products: products, productSubmitStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError("Failed to add product");
            set({ productSubmitStatus: Status.error });
        }
    },

    updateProduct: async (id: number) => {
        const payload: ProductPayload = new ProductPayload({
            title: get().productTitle,
            about: get().productAbout,
            images: get().productImage.split(','),
            price: get().productPrice,
            stock: get().productStock,
            categoryId: get().productCategoryId,
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
