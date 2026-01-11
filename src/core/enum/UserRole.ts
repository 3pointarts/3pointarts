export const UserRole = {
    customer: "customer",
    admin: "admin",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];
