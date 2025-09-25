export const checkIsEmpty = (value: any) => {
    return value === null || value === undefined || value === "" || value === '' || value === ' ' || value === 'undefined' || value === "{}" || value === "[]" || value.length === 0
}