import { FieldValidations } from "./field-validations";

export type Field = {
    id: string;
    type: string;
    required?: boolean;
    step?: number;
    validations?: FieldValidations;
    label?: string;
    placeholder?: string;
    options?: { label: string; value: string }[];
};