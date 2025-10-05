import { Field } from "@/core/types/field";
import * as Yup from "yup";

export interface DataValidator<T extends object = any> {
    validate(field: Field, language: string, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
}