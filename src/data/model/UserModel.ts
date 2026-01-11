import type { UserRole } from "../../core/enum/UserRole";

export class UserModel {
    id: string;
    createdAt: Date;
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    constructor(
        id: string,
        createdAt: Date,
        name: string,
        email: string,
        phone: string,
        role: UserRole,
        password?: string
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }

    static fromMap(json: any): UserModel {
        return new UserModel(
            json.id,
            json.created_at ? new Date(json.created_at) : new Date(),
            json.name,
            json.email,
            json.phone,
            json.role as UserRole,
            json.password,
        );
    }
}
