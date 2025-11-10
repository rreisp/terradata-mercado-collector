import * as Yup from "yup";
import { Field } from "@/core/types/field";

export type DynamicFormProps = {
    schemaId: string;
    editMode: boolean;
    itemId: number;
    onExport: (values: any[]) => Promise<void>;
    onLoad: (rootItemId: number) => Promise<{ [key: string]: any }>;
    onUpdate: (values: any[]) => Promise<void>;
    onValidate: (field: Field, language: string) => Yup.ObjectSchema<any>,
};
