import { UserRole } from "../../core/enum/UserRole";

export class UserPayload {
    name: string;
    email: string;
    phone: string;
    password?: string;
    role: UserRole;
    constructor(
        name: string,
        email: string,
        phone: string,
        role?: UserRole,
        password?: string
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.role = role ?? UserRole.customer;
    }
    toMap(): any {
        return {
            "name": this.name,
            "email": this.email,
            "phone": this.phone,
            "role": this.role,
            "password": this.password,
        };
    }
}
