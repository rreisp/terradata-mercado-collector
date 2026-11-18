import { DataExporter } from "@/core/types/data-exporter";

export class TerradataPesquisaFrutasExporter implements DataExporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaFrutasExporter.export")
            console.log(e)
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaFrutasExporter.exportPDF")
            console.log(e)
        }
    }

    async exportAll() {
        try {
        } catch (e) {
            console.error("TerradataPesquisaFrutasExporter.exportAll")
            console.log(e)
        }
    }
}
