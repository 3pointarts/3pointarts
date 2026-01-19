import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { UserModel } from "../../data/model/UserModel";
import { Status } from "../../core/enum/Status";
import { AuthDatasource } from "../../data/datasource/AuthDatasource";
import { showError, showSuccess } from "../../core/message";
import { UserPayload } from "../../data/payload/UserPayload";
import { UserRole } from "../../core/enum/UserRole";
import useCartStore from "./CartStore";
import useCustomerOrderStore from "./CustomerOrderStore";
import useWishlistStore from "./WishlistStore";
const authDatasource = new AuthDatasource();

interface CustomerAuthState {
    // State
    loginStatus: Status;
    step: number;
    otpStatus: Status;
    email: string;
    otp: string;
    generatedOtp: string; // For simulation
    name: string;
    phone: string;
    customer: UserModel | null;

    // Actions
    init: () => void;
    setEmail: (email: string) => void;
    setOtp: (otp: string) => void;
    setName: (name: string) => void;
    setPhone: (phone: string) => void;
    setStep: (step: number) => void;
    sendOtp: () => Promise<void>;
    verifyOtp: (otp: string) => boolean;
    checkUserExists: () => Promise<boolean>;
    login: () => Promise<void>;
    register: () => Promise<void>;
    logout: () => void;
}

const CustomerAuthStore: StateCreator<CustomerAuthState> = (set, get) => ({
    customer: null,
    loginStatus: Status.init,
    otpStatus: Status.init,
    email: "",
    otp: "",
    generatedOtp: "",
    name: "",
    phone: "",
    step: 1,

    setStep: (step: number) => set({ step: step }),
    setEmail: (email: string) => set({ email }),
    setOtp: (otp: string) => set({ otp }),
    setName: (name: string) => set({ name }),
    setPhone: (phone: string) => set({ phone }),
    init: () => {
        set(() => ({ loginStatus: Status.loading, customer: null }));
        const customer = localStorage.getItem('customer');
        if (customer) {
            set(() => ({ customer: UserModel.fromMap(JSON.parse(customer)), loginStatus: Status.success }));
            setTimeout(() => {
                useCartStore.getState().loadCarts();
                useCustomerOrderStore.getState().loadOrders();
                useWishlistStore.getState().loadWishlists();
            }, 500);
        } else {

            set(() => ({ loginStatus: Status.init }));
        }
    },
    sendOtp: async () => {
        const { phone } = get();
        if (!phone) {
            showError("Please enter your phone number");
            return;
        }
        set({ otpStatus: Status.loading });

        // Generate OTP
        const otp = Math.floor(100000 + (Math.random() * 900000)).toString();

        try {
            await authDatasource.sendPhoneOtp(phone, otp);
            set({ generatedOtp: otp, otpStatus: Status.success, step: 2 });
            showSuccess(`OTP sent to ${phone}`);
        } catch (e) {
            set({ otpStatus: Status.error });
            showError("Failed to send OTP");
            console.error(e);
        }
    },

    verifyOtp: (otp: string) => {
        const { generatedOtp } = get();
        if (otp !== generatedOtp) {
            showError("Invalid OTP");
            return false;
        }
        return true;
    },

    checkUserExists: async () => {
        const { phone } = get();
        try {
            const user = await authDatasource.customerLoginByPhone(phone);
            if (user) {
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    },



    login: async () => {
        const { phone } = get();
        set({ loginStatus: Status.loading });
        try {
            const user = await authDatasource.customerLoginByPhone(phone);
            if (user) {
                localStorage.setItem('customer', JSON.stringify(user));
                const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
                if (redirectAfterLogin) {
                    setTimeout(() => {
                        window.location.href = redirectAfterLogin;
                        localStorage.removeItem("redirectAfterLogin");
                    }, 1000);
                }
                showSuccess('Login Successful!');
                set({ customer: user, loginStatus: Status.success });
            } else {
                showError("User not found");
                set({ loginStatus: Status.error });
            }
        } catch (error) {
            console.error(error);
            showError('Login Failed');
            set({ loginStatus: Status.error });
        }
    },

    register: async () => {
        const { email, name, phone } = get();
        set({ loginStatus: Status.loading });
        try {
            const payload = new UserPayload(
                name,
                email,
                phone,
                UserRole.customer
            );
            const user = await authDatasource.customerRegister(payload);
            localStorage.setItem('customer', JSON.stringify(user));
            const redirectAfterLogin = localStorage.getItem("redirectAfterLogin");
            if (redirectAfterLogin) {
                setTimeout(() => {
                    window.location.href = redirectAfterLogin;
                    localStorage.removeItem("redirectAfterLogin");
                }, 1000);
            }
            showSuccess('Registration Successful! Welcome.');
            set({ customer: user, loginStatus: Status.success });
        } catch (error) {
            console.error(error);
            showError('Registration Failed');
            set({ loginStatus: Status.error });
        }
    },

    logout: () => {
        set({ customer: null, loginStatus: Status.init, email: "", otp: "", generatedOtp: "", step: 1 });
        localStorage.removeItem('customer');
    }
});

const useCustomerAuthStore = create<CustomerAuthState>()(
    devtools(
        CustomerAuthStore,
        { name: "customer-auth-store" }
    )
);

export default useCustomerAuthStore;
