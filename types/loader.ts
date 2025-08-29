export interface DataLoader {
    load(schemaId: string, itemId: number): { [key: string]: any };
}