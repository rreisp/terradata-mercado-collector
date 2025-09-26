export interface DataRemover {
    remove(itemId: number): Promise<void>;
}