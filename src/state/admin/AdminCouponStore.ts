import { create, type StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { Status } from "../../core/enum/Status";
import { CouponModel } from "../../data/model/CouponModel";
import { CouponPayload } from "../../data/payload/CouponPayload";
import { CouponDatasource } from "../../data/datasource/CouponDatasource";
import { showError, showSuccess } from "../../core/message";
import { CouponType } from "../../core/enum/CouponType";
import { CouponCondition } from "../../core/enum/CouponCondition";

const datasource = new CouponDatasource();

interface AdminCouponState {
    coupons: CouponModel[];
    status: Status;
    saveStatus: Status;

    // Form State
    formId: number | null; // null for create
    formCode: string;
    formValue: number;
    formConditionValue: number | null;
    formEndDate: string | null;
    formActive: boolean;
    formType: CouponType;
    formCondition: CouponCondition | null;

    // Actions
    loadCoupons: () => Promise<void>;

    setFormId: (id: number | null) => void;
    setFormCode: (code: string) => void;
    setFormValue: (value: number) => void;
    setFormConditionValue: (value: number | null) => void;
    setFormEndDate: (date: string | null) => void;
    setFormActive: (active: boolean) => void;
    setFormType: (type: CouponType) => void;
    setFormCondition: (condition: CouponCondition | null) => void;

    resetForm: () => void;
    setFormFromModel: (model: CouponModel) => void;

    saveCoupon: () => Promise<boolean>;
    deleteCoupon: (id: number) => Promise<void>;
}

const AdminCouponStore: StateCreator<AdminCouponState> = (set, get) => ({
    coupons: [],
    status: Status.init,
    saveStatus: Status.init,

    formId: null,
    formCode: "",
    formValue: 0,
    formEndDate: null,
    formActive: true,
    formType: CouponType.percentage,
    formCondition: null,
    formConditionValue: null,

    loadCoupons: async () => {
        set({ status: Status.loading });
        try {
            const coupons = await datasource.listCoupons();
            set({ coupons, status: Status.success });
        } catch (error) {
            console.error(error);
            set({ status: Status.error });
            showError("Failed to load coupons");
        }
    },

    setFormId: (id) => set({ formId: id }),
    setFormCode: (code) => set({ formCode: code }),
    setFormValue: (value) => set({ formValue: value }),
    setFormEndDate: (date) => set({ formEndDate: date }),
    setFormActive: (active) => set({ formActive: active }),
    setFormType: (type) => set({ formType: type }),
    setFormCondition: (condition) => set({ formCondition: condition }),
    setFormConditionValue: (value) => set({ formConditionValue: value }),

    resetForm: () => set({
        formId: null,
        formCode: "",
        formValue: 0,
        formEndDate: null,
        formActive: true,
        formType: CouponType.percentage,
        formCondition: null,
        formConditionValue: null,
        saveStatus: Status.init
    }),

    setFormFromModel: (model) => set({
        formId: model.id,
        formCode: model.code,
        formValue: model.value,
        formEndDate: model.endDate,
        formActive: model.active,
        formType: model.type,
        formCondition: model.condition,
        formConditionValue: model.conditionValue
    }),

    saveCoupon: async () => {
        const {
            formId, formCode, formValue, formEndDate, formActive, formType, formCondition, formConditionValue
        } = get();

        if (!formCode || formValue < 0) {
            showError("Please fill in required fields correctly");
            return false;
        }

        set({ saveStatus: Status.loading });

        const payload = new CouponPayload({
            code: formCode,
            value: formValue,
            endDate: formEndDate,
            active: formActive,
            type: formType,
            condition: formCondition,
            conditionValue: formConditionValue
        });

        try {
            if (formId) {
                await datasource.updateCoupon(formId, payload);
                showSuccess("Coupon updated successfully");
            } else {
                await datasource.addCoupon(payload);
                showSuccess("Coupon created successfully");
            }
            set({ saveStatus: Status.success });
            get().resetForm();
            get().loadCoupons();
            return true;
        } catch (error) {
            console.error(error);
            set({ saveStatus: Status.error });
            showError("Failed to save coupon");
            return false;
        }
    },

    deleteCoupon: async (id) => {
        try {
            if (!confirm("Are you sure you want to delete this coupon?")) return;
            await datasource.deleteCoupon(id);
            showSuccess("Coupon deleted successfully");
            get().loadCoupons();
        } catch (error) {
            console.error(error);
            showError("Failed to delete coupon");
        }
    }
});

const useAdminCouponStore = create<AdminCouponState>()(
    devtools(
        AdminCouponStore,
        { name: "admin-coupon-store" }
    )
);

export default useAdminCouponStore;
