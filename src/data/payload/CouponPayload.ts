import { CouponCondition } from "../../core/enum/CouponCondition";
import type { CouponType } from "../../core/enum/CouponType";

export class CouponPayload {
    code: string;
    value: number;
    endDate: string | null;
    active: boolean;
    type: CouponType;
    condition: CouponCondition | null;
    conditionValue: number | null;

    constructor({
        code,
        value,
        endDate,
        active,
        type,
        condition,
        conditionValue
    }: {
        code: string;
        value: number;
        endDate: string | null;
        active: boolean;
        type: CouponType;
        condition: CouponCondition | null;
        conditionValue: number | null;
    }) {
        this.code = code;
        this.value = value;
        this.endDate = endDate;
        this.active = active;
        this.type = type;
        this.condition = condition;
        this.conditionValue = conditionValue;
    }

    toMap(): any {
        return {
            code: this.code,
            value: this.value,
            end_date: this.endDate,
            active: this.active,
            type: this.type,
            condition: this.condition,
            condition_value: this.conditionValue
        };
    }
}
