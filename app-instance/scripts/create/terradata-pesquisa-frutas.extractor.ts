import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaFrutasExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const frutas = this.extractFrutasInfo(info);
            await this.saveFrutas(frutas);

            const lastFrutasId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastFrutasId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaFrutasExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async saveFrutas(data: any) {
        try {
            await CrudService.insert('mercado_frutas', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                abacate: data.abacate,
                abacaxi: data.abacaxi,
                banana_caturra: data.banana_caturra,
                banana_prata: data.banana_prata,
                laranja_pera_rio: data.laranja_pera_rio,
                limao_tahiti: data.limao_tahiti,
                maca_fuji: data.maca_fuji,
                mamao_havai: data.mamao_havai,
                manga_palmer: data.manga_palmer,
                manga_tommy: data.manga_tommy,
                mexerica_ponkan: data.mexerica_ponkan,
                melancia: data.melancia,
                morango: data.morango,
                pera: data.pera,
                uva_italia: data.uva_italia
            });
        } catch (e) {
            console.error("TerradataPesquisaFrutasExtractor.saveFrutas")
            console.log(e)
        }
    }
    
    private extractFrutasInfo(info: any) {
        try {
            return {
                estabelecimento: info.estabelecimento,
                data: info.data,
                abacate: info.abacate,
                abacaxi: info.abacaxi,
                banana_caturra: info.banana_caturra,
                banana_prata: info.banana_prata,
                laranja_pera_rio: info.laranja_pera_rio,
                limao_tahiti: info.limao_tahiti,
                maca_fuji: info.maca_fuji,
                mamao_havai: info.mamao_havai,
                manga_palmer: info.manga_palmer,
                manga_tommy: info.manga_tommy,
                mexerica_ponkan: info.mexerica_ponkan,
                melancia: info.melancia,
                morango: info.morango,
                pera: info.pera,
                uva_italia: info.uva_italia
            }
        } catch (e) {
            console.error("TerradataPesquisaFrutasExtractor.extractFrutasInfo")
            console.log(e)
        }
    }
}
