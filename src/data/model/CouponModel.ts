import { CouponCondition } from "../../core/enum/CouponCondition";
import type { CouponType } from "../../core/enum/CouponType";

export class CouponModel {
    id: number;
    createdAt: string;
    code: string;
    value: number;
    endDate: string | null;
    active: boolean;
    type: CouponType;
    condition: CouponCondition | null;
    conditionValue: number | null;

    constructor({
        id,
        createdAt,
        code,
        value,
        endDate,
        active,
        type,
        condition,
        conditionValue
    }: {
        id: number;
        createdAt: string;
        code: string;
        value: number;
        endDate: string | null;
        active: boolean;
        type: CouponType;
        condition: CouponCondition | null;
        conditionValue: number | null;
    }) {
        this.id = id;
        this.createdAt = createdAt;
        this.code = code;
        this.value = value;
        this.endDate = endDate;
        this.active = active;
        this.type = type;
        this.condition = condition;
        this.conditionValue = conditionValue;
    }

    static fromMap(map: any): CouponModel {
        return new CouponModel({
            id: map.id,
            createdAt: map.created_at,
            code: map.code,
            value: map.value,
            endDate: map.end_date,
            active: map.active,
            type: map.type as CouponType,
            condition: map.condition as CouponCondition,
            conditionValue: map.condition_value
        });
    }
}
