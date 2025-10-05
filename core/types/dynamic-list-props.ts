export type DynamicListProps = {
    schemaId: string;
    columns: string[];
    onDelete: (rootItemId: number) => Promise<void>;
    onExport: (rootItemId: number, language: string) => Promise<any>;
    onExportAll: (language: string) => Promise<any>;    
    onList: (language: string) =>  Promise<any[]>;
    onReset: () => Promise<void>;
};
