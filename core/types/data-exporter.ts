export interface DataExporter {
    export(itemId: number,  language: string): any;
    exportAll(language: string): any;    
}