import { Field } from "./field";

export interface FieldRendererProps {
  field: Field;
  editMode?: boolean;
  formik: {
    value: any;
    onChange: (fieldId: string, value: any) => void;
    errors?: { [key: string]: string };
    touched?: { [key: string]: boolean };
  };
}