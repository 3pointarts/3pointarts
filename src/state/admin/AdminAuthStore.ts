import { create, type StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { UserModel } from "../../data/model/UserModel";
import { Status } from "../../core/enum/Status";
import { AuthDatasource } from "../../data/datasource/AuthDatasource";
import { showError, showSuccess } from "../../core/message";
import useAdminOrderStore from "./AdminOrderStore";

const authDatasource = new AuthDatasource();

interface AdminAuthState {
    //state
    loginStatus: Status;
    email: string;
    password: string;
    admin: UserModel | null;
    //event
    init: () => Promise<void>,
    setEmail: (email: string) => Promise<void>,
    setPassword: (password: string) => Promise<void>,
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AdminAuthStore: StateCreator<AdminAuthState> = (set, get) => ({
    admin: null,
    loginStatus: Status.init,
    email: "",
    password: "",
    //event
    init: async () => {
        set((state) => ({ loginStatus: Status.init, admin: null }));
        let a = localStorage.getItem('admin');
        if (a) {
            useAdminOrderStore.getState().init();
            set((state) => ({ admin: UserModel.fromMap(JSON.parse(a)), loginStatus: Status.success }));
        }
    },
    setEmail: async (email: string) => set({ email }),
    setPassword: async (password: string) => set({ password }),
    login: async () => {
        const { email, password } = get();
        set((state) => ({ loginStatus: Status.loading }));
        try {
            const admin = await authDatasource.adminLogin(email, password);
            localStorage.setItem('admin', JSON.stringify(admin));
            showSuccess('Login Successful! Welcome Admin.');
            set((state) => ({ admin: admin, loginStatus: Status.success, email: '', password: '' }));
        } catch (error) {
            console.error(error);
            showError('Login Failed! Please check your email and password.');
            set((state) => ({ loginStatus: Status.error }));
        }
    },
    logout: async () => {
        set((state) => ({ admin: null, loginStatus: Status.init }));
        localStorage.removeItem('admin');
    },
});

const useAdminAuthStore = create<AdminAuthState>()(
    devtools(
        AdminAuthStore
        // persist(
        //     AdminAuthStore,
        //     { name: "admin-auth-store" }
        // )
    )
);
export default useAdminAuthStore;