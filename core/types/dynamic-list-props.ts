export type DynamicListProps = {
    schemaId: string;
    onList: () =>  Promise<any[]>;
    columns: string[];
    onDelete: (rootItemId: number) => Promise<void>;
    onReset: () => Promise<void>;
};
