import { FormikErrors, FormikTouched } from "formik";

export type FormikHelpers = {
    value: any;
    onChange: (id: string, value: any) => void;
    errors?: FormikErrors<{ [key: string]: any }>;
    touched?: FormikTouched<{ [key: string]: any }>;
    setFieldTouched?: (field: string, touched?: boolean) => void;
};
