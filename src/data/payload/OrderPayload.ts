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
    couponCode?: string | null;
    couponValue?: number | null;

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
        couponCode = null,
        couponValue = null,
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
        couponCode?: string | null;
        couponValue?: number | null;
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
        this.couponCode = couponCode;
        this.couponValue = couponValue;
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
            coupon_code: this.couponCode,
            coupon_value: this.couponValue,
        };
    }
}
