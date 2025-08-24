export interface Loader {
    load(itemId: number): { [key: string]: any };
}