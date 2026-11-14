import { DataExporter } from "@/core/types/data-exporter";

export class MercadoInconfidentesCombustiveisExporter implements DataExporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExporter.export")
            console.log(e)
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExporter.exportPDF")
            console.log(e)
        }
    }

    async exportAll() {
        try {
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExporter.exportAll")
            console.log(e)
        }
    }
}
