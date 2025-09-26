import * as Yup from "yup";
import { Field } from "@/core/types/field";

export type DynamicFormProps = {
    schemaId: string;
    editMode: boolean;
    itemId: number;
    extract: (values: any[]) => Promise<void>;
    load: (rootItemId: number) => Promise<{ [key: string]: any }>;
    update: (values: any[]) => Promise<void>;
    validate: (field: Field, language: string) => Yup.ObjectSchema<any>,
};
