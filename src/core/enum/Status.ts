export const Status = {
    init: "init",
    loading: "loading",
    success: "success",
    error: "error",
} as const;

export type Status = typeof Status[keyof typeof Status];
