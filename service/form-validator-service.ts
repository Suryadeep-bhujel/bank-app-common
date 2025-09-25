import { checkIsEmpty } from "@bank-app-common/functions/shared-functions";
import { FormRules } from "@bank-app-common/service/form-rules-service";
import { ErrorBagInterface, ValidationFormDataType } from "@bank-app-common/service/validation-base-service";

export default class FormValidator<K extends number> extends FormRules {
    private errorItemBags: Map<K, ErrorBagInterface[]> = new Map();
    constructor(data: [] | object, rules: object, messages: { [key: string]: string }, dbData: object, rowNo: K) { // TODO add null to check single object validation
        super()
        this.formErrors = []
        this.dbData = dbData;
        if (typeof data === 'object') {
            this.validatedElemType = ValidationFormDataType.OBJECT
            this.dataObj = data;
            const errors = this.validate(this.dataObj, rules, messages, rowNo)
            this.formErrors.push(errors)
            this.dataObj = {};
        }
        if (Array.isArray(data)) {
            this.validatedElemType = ValidationFormDataType.ARRAY
            this.dataList = data;
            this.dataList.forEach((element: any, index) => {
                this.dataObj = element;
                const errors = this.validate(element, rules, messages, rowNo)
                this.formErrors.push(errors)
            });
            this.dataObj = {};
        }
        this.dataList = [];
        this.dbData = {};
    }
    validate(data: object, rules: object, customeMessages: object, rowNo: K) {
        const itemErrors: any[] = []
        const rowErrorBag: ErrorBagInterface[] = []
        this.formErrors[rowNo] = []
        this.errorItemBags.set(rowNo, itemErrors)
        for (const field in rules) {
            this.activeField = field;
            let fieldRules = (rules[field].split("|")).filter(item => !checkIsEmpty(item))
            console.log("fieldRulesfieldRulesfieldRules", fieldRules)
            const activeValue = data[field]
            for (const rule of fieldRules) {
                console.log("ruleNameruleNameruleName", rule)
                const [ruleName, ...params] = rule.split(":");
                const paramsArray = params.length ? params[0].split(",") : []
                const isOptionalRule = this.optionalMethods.findIndex(ruleItem => ruleItem === ruleName) !== -1;
                if (isOptionalRule && !checkIsEmpty(activeValue)) {
                    fieldRules = [];
                    // if the current rule is optional and only needed execute if value is present but value not available currently will stop the rest of the validation 
                    break;
                }
                if (typeof this[ruleName] === 'function' && !isOptionalRule) {
                    // run data validation by each field
                    const isValid = this[ruleName](activeValue, ...paramsArray)
                    if (!isValid) {
                        const defaultMessage = this.getDefaultMessage(ruleName, field, rowNo, paramsArray)
                        const customeMessage = customeMessages[`${field}.${ruleName}`]
                        // const customeMessage = customeMessages[`${field}.${ruleName}${paramsArray[0]}`]
                        const errorMessage = !checkIsEmpty(customeMessage)
                            ? this.generateMessage(customeMessage, { field, value: activeValue, rowIndex: rowNo, params: paramsArray })
                            : this.generateMessage(defaultMessage, { field, value: activeValue, rowIndex: rowNo, params: paramsArray })
                        itemErrors.push(errorMessage)
                        rowErrorBag.push({
                            field: field,
                            rule: ruleName,
                            value: activeValue,
                            validated: isValid,
                            row: rowNo,
                            message: errorMessage,
                            params: paramsArray

                        })
                    } else {
                        if (checkIsEmpty(activeValue) || isValid === "skip") {
                            // if returned result is skip meaning skip the further validation  and assuming data are validated
                            fieldRules = [];
                            break;
                        }
                    }
                } else if (!this.optionalMethods.includes(ruleName)) {
                    itemErrors.push(`Validation rule "${ruleName}" is not defined at ${this.activeField}`)
                    rowErrorBag.push({
                        field: field,
                        rule: ruleName,
                        value: activeValue,
                        validated: false,
                        row: rowNo,
                        message: `Validation rule "${ruleName}" is not defined at ${this.activeField}`,
                        params: paramsArray
                    })
                    // throw new Error(`Validation rule "${ruleName}" is not defined at ${this.activeField}`)
                }
            }
        }
        this.errorItemBags.set(rowNo, rowErrorBag)
        return itemErrors;
    }

    public getErrorItemBags() {
        return this.errorItemBags;
    }
}