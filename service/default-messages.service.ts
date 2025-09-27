import { BaseValidationService, DataFormat, ValidationFormDataType } from "@bank-app-common/service/validation-base-service";

export class DefaultMessages extends BaseValidationService {
    public validatedElemType: ValidationFormDataType = ValidationFormDataType.ARRAY
    constructor() {
        super()
    }


    public messages: { [key: string]: string } = {
        required: `:field is required`,
        exists: `:field = :value doesn't exists in the system`,
        number: `:field value should be valid number`,
        maxNum: `:field value can be maximum :params`,
        minNum: `:field value should be minimum :params`,
        string: `:field should be valid string or text`,
        maxLength: `:field value can be maximum :params charactors long`,
        minLength: `:field value should be minimum :params charactors long`,
        after: `:field should be date after :params`,
        before : `:field should be date before :params`,
        afterOrEqual : `:field should be date equal or after :params`,
        beforeOrEqual :`:field should be date equal or before :params`,
        email: `:field should be valid email address`,
        date_format: `Invalid Date Format, :field should be valid date, accepted format is :params`,
        dateAfter : `:field should be date after :params`,
        dateAfterOrEqual : `:field should be date equal or after :params`,
        dateBeforeOrEqual : `:field should be date equal or before :params`,
        dateRange : `:field date should be range between :params`,
        priceRange : `:field price should be range between :params`,
        isValid : `Invalid value for :field`,
        ageAfter : `Invalid age value in :field, age should be more than :params`,
        ageBefore : `Invalid age value in :field, age should be less than :params`,
        unique : ":field value should be unique in :params",
        
    }
    getDefaultMessage(rule: string, field?: string, rowIndex?: number, params?: any[]) {
        let message = this.messages[rule] || `:field validation failed using rule= "${rule}"`
        message += this.validatedElemType === ValidationFormDataType.ARRAY ? ' at Row No: :rowIndex' : '.';
        return message;
    }
    generateMessage(messageTemplate, data: DataFormat) {
        return messageTemplate
            .replace(/:field/g, data.field)
            .replace(/:rowIndex/g, data.rowIndex)
            .replace(/:value/g, data.value)
            .replace(/:params/g, data.params ? data.params.join(", ") : "")
            .replace(/now/g, "current date")
    }
}