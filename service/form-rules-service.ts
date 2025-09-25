import { checkIsEmpty } from "@bank-app-common/functions/shared-functions";
import { DefaultMessages } from "@bank-app-common/service/default-messages.service";
import { FormRuleInterface } from "@bank-app-common/service/validation-base-service";
export class FormRules extends DefaultMessages implements FormRuleInterface {
    public activeField;
    constructor() {
        super();
    }
    required(val, ...args): boolean {
        return !checkIsEmpty(val);
    }
    optional(val, ...args) {
        if (checkIsEmpty(val)) return "skip";
        return true;
    }
    string(val, ...args): boolean {
        if (checkIsEmpty(val)) return false;
        return typeof val === 'string'
    }
    number(val, ...args): boolean {
        if (checkIsEmpty(val)) return false;
        if (typeof val === 'bigint') return true;
        if (typeof val === 'number') return !isNaN(val);
        return !isNaN(val) && isFinite(Number(val)); //valid if numbers are "12.4", "135.42"
    }
    nullable(val, ...args) {
        if (checkIsEmpty(val)) return "skip";
        return true;
    }

    exists(val, ...args) {
        const [tableName, fieldName] = args;
        if (!(tableName in this.dbData)) return false;
        if (!checkIsEmpty(fieldName)) {
            return this.dbData?.[tableName].findIndex(elem => elem?.[fieldName] === val) !== -1
        }
        return this.dbData?.[tableName].findIndex(elem => elem === val) !== -1
    }

    price(val: number | bigint, ...args): boolean {
        if (this.number(val)) return true;
        return false;
    }

    maxNum(val: number | bigint, ...args): boolean {
        if (!this.number(val)) return false;
        const [maxVal] = args;
        if (!this.number(maxVal)) return false;
        if (Number(val) <= Number(maxVal)) return true;
        return false;
    }

    minNum(val: number | bigint, ...args): boolean {
        if (!this.number(val)) return false;
        const [minVal] = args;
        if (!this.number(minVal)) return false;
        if (Number(val) >= Number(minVal)) return true;
        return false;
    }

    maxLength(val: string, ...args) {
        if (checkIsEmpty(val)) return false;
        const [maxStrLength] = args;
        if (!this.number(maxStrLength)) return false;
        if (val.length <= maxStrLength) return true;
        return false;
    }

    minLength(val: string, ...args) {
        if (checkIsEmpty(val)) return false;
        const [minStrLength] = args;
        if (!this.number(minStrLength)) return false;
        if (val.length >= minStrLength) return true;
        return false;
    }
    //**
    // date related validation methods */
    date_format(val, ...args): boolean {
        return false;
    }
    before(val, ...args):boolean {
        return false;
    }
    after(val, ...args):boolean {
        return false;
    }
    beforeOrEqual(val, ...args):boolean {
        return false;
    }
    afterOrEqual(val, ...args):boolean {
        return false;
    }

}