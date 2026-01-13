import { OrderStatus } from "../../core/enum/OrderStatus";
import { OrderItemPayload } from "./OrderItemPayload";

export class OrderPayload {
    customerId: number;
    billTo: string;
    contactName: string;
    contactPhone: string;
    contactAddress: string;
    note: string;
    total: number;
    status: OrderStatus;
    items: OrderItemPayload[];

    constructor({
        customerId,
        billTo,
        contactName,
        contactPhone,
        contactAddress,
        note,
        total,
        status = OrderStatus.new,
        items = [],
    }: {
        customerId: number;
        billTo: string;
        contactName: string;
        contactPhone: string;
        contactAddress: string;
        note: string;
        total: number;
        status?: OrderStatus;
        items?: OrderItemPayload[];
    }) {
        this.customerId = customerId;
        this.billTo = billTo;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
        this.contactAddress = contactAddress;
        this.note = note;
        this.total = total;
        this.status = status;
        this.items = items;
    }

    toMap(): any {
        return {
            customer_id: this.customerId,
            bill_to: this.billTo,
            contact_name: this.contactName,
            contact_phone: this.contactPhone,
            contact_address: this.contactAddress,
            note: this.note,
            total: this.total,
            status: this.status,
        };
    }
}
