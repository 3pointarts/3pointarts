import { http } from "../../core/http/HttpClient";
import { UserModel } from "../model/UserModel";
import type { UserPayload } from "../payload/UserPayload";


const BASE_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/users";

export class AuthDatasource {
    async adminLogin(email: string, password: string): Promise<UserModel> {
        let a = (await http<any[]>(BASE_URL + '?email=eq.' + email + '&password=eq.' + password));
        if (a.length > 0) {
            return UserModel.fromMap(a[0]);
        } else {
            throw new Error("Invalid email or password");
        }
    }

    async createUser(payload: UserPayload): Promise<UserModel[]> {
        const res = await http<any[]>(BASE_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
        return res.map(u => UserModel.fromMap(u));
    }

    async listCustomers(): Promise<UserModel[]> {
        const res = await http<any[]>(BASE_URL + '?role=eq.customer');
        return res.map(u => UserModel.fromMap(u));
    }

    async customerLogin(email: string): Promise<UserModel | null> {
        const users = await http<any[]>(BASE_URL + '?email=eq.' + email);
        if (users.length > 0) {
            return UserModel.fromMap(users[0]);
        }
        return null;
    }

    async customerRegister(payload: UserPayload): Promise<UserModel> {
        const users = await this.createUser(payload);
        if (users.length > 0) {
            return users[0];
        }
        throw new Error("Failed to register customer");
    }
}
