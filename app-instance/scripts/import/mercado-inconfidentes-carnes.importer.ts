import { DataImporter } from "@/core/types/data-importer";

export class MercadoInconfidentesCarnesImporter implements DataImporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    public async importDatabase(): Promise<void> {
        try {
        } catch (e) {
            console.error("MercadoInconfidentesCarnesImporter.importDatabase");
            console.log(e);
        }
    }
}