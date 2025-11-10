export type DynamicListProps = {
    schemaId: string;
    columns: string[];
    onDelete: (rootItemId: number) => Promise<void>;
    onExport: (rootItemId: number) => Promise<any>;
    onExportAll: () => Promise<any>;    
    onList: (language: string) =>  Promise<any[]>;
    onInit: () => Promise<void>;
    onReset: () => Promise<void>;
};
