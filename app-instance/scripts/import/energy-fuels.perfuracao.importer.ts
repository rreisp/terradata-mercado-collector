import { DataImporter } from "@/core/types/data-importer";

export class EnergyFuelsDrillingImporter implements DataImporter {
    private language: string;
    private isPT: boolean;

    constructor(language: string) {
        this.language = language;
        this.isPT = language === 'pt-BR';
    }

    importDatabase(database: any) {
        // throw new Error("Method not implemented.");
        console.log('opa mano');
    }
}
