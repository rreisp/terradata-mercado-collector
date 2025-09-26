export type DynamicListProps = {
    schemaId: string;
    columns: string[];
    onDelete: (rootItemId: number) => Promise<void>;
    onExport: (rootItemId: number) => Promise<any>;
    onList: () =>  Promise<any[]>;
    onReset: () => Promise<void>;
};
