import { LocalizedString } from "./localized-string";

export type Field = {
    id: string;
    label: LocalizedString;
    type: string;
    placeholder?: LocalizedString;
    step?: number | undefined;
    min?: number | undefined;
    max?: number | undefined;
    options?: Array<{
        value: string;
        label: LocalizedString;
    }>;
    validations?: {
        max_length?: number;        
        min_length?: number;
        required?: boolean;
        messages?: {
            [rule: string]: LocalizedString;
        };
    };
    [key: string]: any;
};