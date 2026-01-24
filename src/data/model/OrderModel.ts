import { OrderStatus } from "../../core/enum/OrderStatus";
import { UserModel } from "./UserModel";
import { OrderItemModel } from "./OrderItemModel";

export class OrderModel {
    id: number;
    createdAt: Date;
    customerId: number;
    billTo: string;
    contactName: string;
    contactPhone: string;
    contactAddress: string;
    note: string;
    total: number;
    status: OrderStatus;
    customer?: UserModel;
    items?: OrderItemModel[];
    couponCode?: string | null;
    couponValue?: number | null;

    constructor({
        id,
        createdAt,
        customerId,
        billTo,
        contactName,
        contactPhone,
        contactAddress,
        note,
        total,
        status,
        customer,
        items,
        couponCode,
        couponValue,
    }: {
        id: number;
        createdAt: Date;
        customerId: number;
        billTo: string;
        contactName: string;
        contactPhone: string;
        contactAddress: string;
        note: string;
        total: number;
        status: OrderStatus;
        customer?: UserModel;
        items?: OrderItemModel[];
        couponCode?: string | null;
        couponValue?: number | null;
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.customerId = customerId;
        this.billTo = billTo;
        this.contactName = contactName;
        this.contactPhone = contactPhone;
        this.contactAddress = contactAddress;
        this.note = note;
        this.total = total;
        this.status = status;
        this.customer = customer;
        this.items = items;
        this.couponCode = couponCode;
        this.couponValue = couponValue;
    }

    static fromMap(json: any): OrderModel {
        return new OrderModel({
            id: json.id,
            createdAt: new Date(json.created_at),
            customerId: json.customer_id,
            billTo: json.bill_to,
            contactName: json.contact_name,
            contactPhone: json.contact_phone,
            contactAddress: json.contact_address,
            note: json.note,
            total: json.total,
            status: json.status as OrderStatus,
            customer: json.users ? UserModel.fromMap(json.users) : undefined,
            items: json.order_items ? json.order_items.map((item: any) => OrderItemModel.fromMap(item)) : undefined,
            couponCode: json.coupon_code,
            couponValue: json.coupon_value,
        });
    }
}
