import { DataImporter } from "@/core/types/data-importer";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaFrutasImporter implements DataImporter {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    public async importDatabase(): Promise<void> {
        try {
        } catch (e) {
            console.error("TerradataPesquisaFrutasImporter.importDatabase")
            console.log(e)
        }
    }
}
