import { DataExporter } from "@/core/types/data-exporter";

export class TerradataPesquisaBarbeariaExporter implements DataExporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExporter.export")
            console.log(e)
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExporter.exportPDF")
            console.log(e)
        }
    }

    async exportAll() {
        try {
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExporter.exportAll")
            console.log(e)
        }
    }
}
