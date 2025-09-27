import { checkIsEmpty } from "@bank-app-common/functions/shared-functions";
import { DefaultMessages } from "@bank-app-common/service/default-messages.service";
import { FormRuleInterface } from "@bank-app-common/service/validation-base-service";
import dayjs from "dayjs";
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
    unique(val: string | number, ...args: any[]) {
        const [tableName, fieldName] = args;
        if (!(tableName in this.dbData)) return false;
        if (!checkIsEmpty(fieldName)) {
            return this.dbData?.[tableName].findIndex(elem => elem?.[fieldName] === val) === -1
        }
        return this.dbData?.[tableName].findIndex(elem => elem === val) === -1
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
    date_format(date: string, ...args): boolean {
        return this.validateDateFormat(date)
    }
    is_date(date: string): boolean {
        if (!date || typeof date !== "string") return false;

        // common formats you want to accept
        const formats = [
            "DD-MM-YYYY",
            "DD/MM/YYYY",
            "DD-MM-YYYY HH:mm",
            "DD/MM/YYYY HH:mm",
            "YYYY-MM-DD",
            "YYYY/MM/DD",
            "YYYY-MM-DDTHH:mm:ssZ", // ISO with timezone
            "MM-DD-YYYY"
        ];

        // strict check against known formats (requires customParseFormat plugin to be loaded)
        for (const fmt of formats) {
            if (dayjs(date, fmt, true).isValid()) return true;
        }

        // fallback: accept ISO / timestamp / native-parsable values
        return dayjs(date).isValid();
    }


    private validateDateFormat(dateVal: string): boolean {
        // format will be any like DD-MM-YYYY/DD-MMM-YYYY or DD/MM/YYYY or DD/MMM/YYYY
        // const dateFormatValidateRegex = /^([0-2][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        const dateFormatValidateRegex = /^([0-2][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/]\d{4}$/;
        if (!dateFormatValidateRegex.test(dateVal)) return false;
        const [day, month, year] = dateVal.split("-").map(Number)
        const date = new Date(year, month - 1, day);
        return !(date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day)
    }

    before(date1: string, ...args: any[]): boolean {
        let [date2] = args;
        date2 = this.getDate(date2);
        const [dateA, dateB] = this.parseDate(date1, date2)
        return dateA.getTime() < dateB.getTime();
    }
    getDate(date: string): string {
        // const base = new Date();

        const formatDate = (d: Date): string => {
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            return `${dd}-${mm}-${yyyy}`;
        };

        const result = new Date();

        switch (date) {
            case 'today':
                return formatDate(result);

            case 'tomorrow':
                result.setDate(result.getDate() + 1);
                return formatDate(result);

            case 'yesterday':
                result.setDate(result.getDate() - 1);
                return formatDate(result);

            case 'next_week':
                result.setDate(result.getDate() + 7);
                return formatDate(result);

            case 'last_week':
                result.setDate(result.getDate() - 7);
                return formatDate(result);

            case 'next_month':
                result.setMonth(result.getMonth() + 1);
                return formatDate(result);

            case 'last_month':
                result.setMonth(result.getMonth() - 1);
                return formatDate(result);

            case 'next_year':
                result.setFullYear(result.getFullYear() + 1);
                return formatDate(result);

            case 'last_year':
                result.setFullYear(result.getFullYear() - 1);
                return formatDate(result);

            default:
                return date; // if not a keyword, return as is
        }
    }


    after(date1: string, ...args: any[]): boolean {
        const [date2] = args;
        const [dateA, dateB] = this.parseDate(date1, date2)
        return dateA.getTime() > dateB.getTime();
    }

    beforeOrEqual(date1: string, ...args: any[]): boolean {
        const [fieldName] = args;
        const date2 = this.item?.[fieldName]
        return this.tallyDate(date1, date2, true)
    }

    afterOrEqual(date1: string, ...args: any[]): boolean {
        const [fieldName] = args;
        const date2 = this.item?.[fieldName]
        return this.tallyDate(date1, date2, false)
    }

    tallyDate(dateA: string, dateB: string, checkLower: boolean = false) {
        const [date1, date2] = this.parseDate(dateA, dateB)
        return checkLower ? date1.getTime() <= date2.getTime() : date1.getTime() >= date2.getTime()
    }

    private parseDate(...args: string[]): Date[] {
        return args.map(dateItem => {
            const [day, month, year] = dateItem.split('-').map(Number)
            return new Date(year, month - 1, day)
        })
    }

    email(emailString: string): boolean {
        if (typeof emailString !== 'string') return false;
        const raw = emailString.trim();
        if (!raw) return false;

        // split at last @ to allow @ inside quoted local parts (rare)
        const at = raw.lastIndexOf('@');
        if (at === -1) return false;
        const local = raw.slice(0, at);
        const domain = raw.slice(at + 1);

        if (!local || !domain) return false;

        // overall length rules
        if (local.length > 64) return false;
        if (raw.length > 254) return false;

        // reject consecutive dots in the address
        if (raw.includes('..')) return false;

        // local part validation
        const dotAtom = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/;
        const quotedLocal = /^"(?:\\.|[^"\\])*"$/; // allows escaped chars inside quotes

        if (!(dotAtom.test(local) || quotedLocal.test(local))) return false;

        // domain can be an IP-literal like [192.168.0.1] or [IPv6:...]
        const ipLiteral = /^\[(.*)\]$/;
        const ipMatch = domain.match(ipLiteral);
        if (ipMatch) {
            const inside = ipMatch[1];

            // IPv4 check
            const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
            if (ipv4.test(inside)) {
                const parts = inside.split('.').map(Number);
                if (parts.some(n => Number.isNaN(n) || n < 0 || n > 255)) return false;
                return true;
            }

            // IPv6 basic sanity check (full RFC validation is large)
            if (/^IPv6:/i.test(inside)) {
                // accept if contains colons and hex groups (practical check)
                return inside.includes(':');
            }

            return false;
        }

        // domain name validation (labels)
        const labels = domain.split('.');
        if (labels.some(l => l.length === 0)) return false; // empty label (leading/trailing dot or "..")

        const labelRegex = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
        for (const lbl of labels) {
            if (lbl.length > 63) return false;
            if (!labelRegex.test(lbl)) return false;
        }

        // TLD check: at least 2 chars and not all numeric
        const tld = labels[labels.length - 1];
        if (tld.length < 2) return false;
        if (/^\d+$/.test(tld)) return false;

        return true;
    }


}