import { Field } from "@/core/types/field";
import * as Yup from "yup";

export interface DataValidator<T extends object = any> {
    validate(field: Field, editMode: boolean): Yup.ObjectSchema<any, Yup.AnyObject, any, "">;
}