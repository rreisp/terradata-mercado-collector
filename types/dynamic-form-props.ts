import { FormSchema } from "./form-schema";

export type DynamicFormProps = {
    schemaId: string;
    editMode: boolean;
    itemId: number;
    load: (schemaId: string, itemId: number) => Promise<{ [key: string]: any }>;
    extract: (values: any[]) => Promise<void>;
    update: (values: any[]) => Promise<void>;
};
