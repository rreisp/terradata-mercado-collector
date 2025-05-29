import { LocalizedString } from "./localized-string";

export type Field = {
    id: string;
    label: LocalizedString;
    type: string;
    required?: boolean;
    placeholder?: LocalizedString;
    step?: number;
    min?: number;
    max?: number;
    options?: Array<{
        value: string;
        label: LocalizedString;
    }>;
    validations?: {
        min_length?: number;
        required?: boolean;
        messages?: {
            [rule: string]: LocalizedString;
        };
    };
    [key: string]: any;
};