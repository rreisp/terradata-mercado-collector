export interface Loader {
    load(schemaId: string, itemId: number): { [key: string]: any };
}