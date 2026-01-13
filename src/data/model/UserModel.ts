import type { UserRole } from "../../core/enum/UserRole";

export class UserModel {
    id: string;
    createdAt: Date;
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    constructor({
        id,
        createdAt,
        name,
        email,
        phone,
        role,
        password,
    }: {
        id: string,
        createdAt: Date,
        name: string,
        email: string,
        phone: string,
        role: UserRole,
        password?: string
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    static fromMap(json: any): UserModel {
        return new UserModel({
            id: json.id,
            createdAt: json.created_at ? new Date(json.created_at) : new Date(),
            name: json.name,
            email: json.email,
            phone: json.phone,
            role: json.role as UserRole,
            password: json.password,
        });
    }
}
