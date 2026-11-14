import { DataExporter } from "@/core/types/data-exporter";

export class TerradataPesquisaCarnesExporter implements DataExporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCarnesExporter.export");
            console.log(e);
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCarnesExporter.exportPDF");
            console.log(e);
        }
    }

    async exportAll() {
        try {
        } catch (e) {
            console.error("TerradataPesquisaCarnesExporter.exportAll");
            console.log(e);
        }
    }
}