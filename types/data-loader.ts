export interface DataLoader {
    load(rootItemId: number): { [key: string]: any };
}