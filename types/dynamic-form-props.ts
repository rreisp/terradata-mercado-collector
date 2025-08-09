export type DynamicFormProps = {
    schemaId: string;
    extract: (values: any[]) => Promise<void>;
};
