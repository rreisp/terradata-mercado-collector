export interface DataExporter {
    export(itemId: number): any;
    exportPDF(itemId: number): any;
    exportAll(): any;    
}