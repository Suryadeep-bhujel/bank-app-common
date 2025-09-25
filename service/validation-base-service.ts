export class BaseValidationService {
    public formErrors: string[][] = []
    public formErrorBags = [];
    public dataList: object[];
    public dataObj: object;
    public item: object;
    public optionalMethods: any[] = []
    public dbData: object = {};
}
export interface DataFormat {
    field: string
    rowIndex: number
    params: string[]
    value: any
}
export interface FormRuleInterface {
    required: ({ }) => void;
    string: ({ }) => void;
    optional: ({ }) => void;
    number: ({ }) => void;
    exists: ({ }) => void;
    price: ({ }) => void;
    maxNum: ({ }) => void;
    minNum: ({ }) => void;
    maxLength: ({ }) => void;
    minLength: ({ }) => void;
    nullable: ({ }) => void;
    date_format: ({ }) => void;
    after: ({ }) => void;
    before: ({ }) => void;
    afterOrEqual: ({ }) => void;
    beforeOrEqual: ({ }) => void;
}
export interface ErrorBagInterface {
    field: string
    rule?: string
    value?: any
    validated: boolean,
    row: number | bigint,
    message: string,
    params?: []
}
export enum ValidationFormDataType {
    ARRAY = 'array',
    OBJECT = 'object',
}
// export interface MessageInterface {
//     { [key: string]: string }
// }