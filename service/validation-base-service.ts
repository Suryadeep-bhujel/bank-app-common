export class BaseValidationService {
    public formErrors: string[][] = []
    public formErrorBags = [];
    public dataList: object[] = [];
    public dataObj: object = {};
    public item: object = {};
    public optionalMethods: any[] = []
    public dbData: object = {};
    public fieldPrefix?: string;
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
    price: (val: number | bigint, ...args: any[]) => void;
    maxNum: (val: number | bigint, ...args: any[]) => void;
    minNum: (val: number | bigint, ...args: any[]) => void;
    maxLength: (val: string, ...args: any[]) => void;
    minLength: (val: string, ...args: any[]) => void;
    nullable: (val: any, ...args: any[]) => void;
    date_format: (val: string, ...args: any[]) => void;
    after: (val: string, ...args: any[]) => void;
    before: (val: string, ...args: any[]) => void;
    afterOrEqual: (val: string, ...args: any[]) => void;
    beforeOrEqual: (val: string, ...args: any[]) => void;

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