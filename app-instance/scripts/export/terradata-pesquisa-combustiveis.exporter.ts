import { DataExporter } from "@/core/types/data-exporter";

export class TerradataPesquisaCombustiveisExporter implements DataExporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisExporter.export")
            console.log(e)
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisExporter.exportPDF")
            console.log(e)
        }
    }

    async exportAll() {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisExporter.exportAll")
            console.log(e)
        }
    }
}
