import { Field } from "./field";
import { LocalizedString } from "./localized-string";
import { ModalContent } from "./modal-content";
import { ResponsiveSize } from "./responsive-size";

export type FormSchema = {
    formId: string;
    title: LocalizedString;
    description: LocalizedString;
    logo?: string;
    version: string;
    method: string;
    url: string;
    modal: {
        size: string;
        success: ModalContent;
        error: ModalContent;
    };
    grid: {
        columns: number;
        gap?: string | number;
    };
    rows: Array<{
        columns: Array<{
            field: Field;
            size: ResponsiveSize;
        }>;
    }>;
};
