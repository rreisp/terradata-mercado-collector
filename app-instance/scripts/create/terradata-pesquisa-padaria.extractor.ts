import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaPadariaExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const padaria = this.extractPadariaInfo(info);
            await this.savePadaria(padaria);

            const lastPadariaId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastPadariaId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaPadariaExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async savePadaria(data: any) {
        try {
            await CrudService.insert('mercado_padaria', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                pao_frances: data.pao_frances
            });
        } catch (e) {
            console.error("TerradataPesquisaPadariaExtractor.savePadaria")
            console.log(e)
        }
    }
    
    private extractPadariaInfo(info: any) {
        try {
            return {
                estabelecimento: info.estabelecimento,
                data: info.data,
                pao_frances: info.pao_frances
            }
        } catch (e) {
            console.error("TerradataPesquisaPadariaExtractor.extractPadariaInfo")
            console.log(e)
        }
    }
}
