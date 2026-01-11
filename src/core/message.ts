import { toast } from "react-toastify";

export function showSuccess(msg: string) {
    toast.success(msg, { position: "bottom-right" });
}
export function showError(msg: string) {
    toast.error(msg, { position: "bottom-right" });
}
