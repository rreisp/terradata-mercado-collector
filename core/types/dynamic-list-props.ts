export type DynamicListProps = {
    schemaId: string;
    onDelete: (rootItemId: number) => Promise<void>;
    onReset: () => Promise<void>;
};
