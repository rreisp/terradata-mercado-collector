import { Field } from "./field";
import { LocalizedString } from "./localized-string";
import { ModalContent } from "./modal-content";
import { ResponsiveSize } from "./responsive-size";

export type ExportOption = "single" | "all" | "pdf" | "database";

export type FormSchema = {
    formId: string;
    return: 'FORM' | 'LIST';
    title: LocalizedString;
    description: LocalizedString;
    logo?: string;
    export:ExportOption[];
    version: string;
    method: string;
    url: string;
    modal: {
        size: string;
        success: ModalContent;
        error: ModalContent;
    };
    rows: Array<{
        columns: Array<{
            field: Field;
            size: ResponsiveSize;
        }>;
    }>;
};
