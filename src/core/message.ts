import { toast } from "react-toastify";

const getPosition = () => {
    return window.innerWidth < 768 ? "top-right" : "bottom-right";
}

export function showSuccess(msg: string) {
    toast.success(msg, { position: getPosition(), autoClose: 1500 });
}
export function showError(msg: string) {
    toast.error(msg, { position: getPosition(), autoClose: 1500 });
}
