import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaBarbeariaExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const barbearia = this.extractBarbeariaInfo(info);
            await this.saveBarbearia(barbearia);

            const lastBarbeariaId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastBarbeariaId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async saveBarbearia(data: any) {
        try {
            await CrudService.insert('barbearia', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                barba: data.barba,
                cabelo: data.cabelo
            });
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExtractor.saveBarbearia")
            console.log(e)
        }
    }
    
    private extractBarbeariaInfo(info: any) {
        try {
            return {
                estabelecimento: info.estabelecimento,
                data: info.data,
                barba: info.barba,
                cabelo: info.cabelo
            }
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaExtractor.extractBarbeariaInfo")
            console.log(e)
        }
    }
}
