import { FormSchema } from "./form-schema";

export type DynamicFormProps = {
    schemaId: string;
    editMode: boolean;
    itemId: number;
    extract: (values: any[]) => Promise<void>;
    load: (rootItemId: number) => Promise<{ [key: string]: any }>;
    update: (values: any[]) => Promise<void>;
};
