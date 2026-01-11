import { http } from "../../core/http/HttpClient";
import type { UserModel } from "../model/UserModel";
import type { UserPayload } from "../payload/UserPayload";


const BASE_URL = import.meta.env.VITE_SUPABASE_URL + "/rest/v1/users";

export class AuthDatasource {
    async adminLogin(email: string, password: string): Promise<UserModel> {
        let a = (await http<UserModel[]>(BASE_URL + '?email=eq.' + email + '&password=eq.' + password));
        if (a.length > 0) {
            return a[0];
        } else {
            throw new Error("Invalid email or password");
        }
    }

    async createUser(payload: UserPayload): Promise<UserModel[]> {
        return http<UserModel[]>(BASE_URL, {
            method: "POST",
            headers: {
                Prefer: "return=representation",
            },
            body: JSON.stringify(payload.toMap()),
        });
    }

    async listCustomers(): Promise<UserModel[]> {
        return http<UserModel[]>(BASE_URL + '?role=eq.customer');
    }
}
