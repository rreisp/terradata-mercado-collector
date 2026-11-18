import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaFrutasUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const frutas = this.extractFrutasInfo(info);
            await this.updateFrutas(frutas);

            console.log(`Registro com ID ${frutas!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaFrutasUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateFrutas(data: any) {
        try {
            await CrudService.update('mercado_frutas', {
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
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaFrutasUpdater.updateFrutas")
            console.log(e)
        }
    }

    private extractFrutasInfo(info: any) {
        try {
            return {
                id: info.id,
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
            console.error("TerradataPesquisaFrutasUpdater.extractFrutasInfo")
            console.log(e)
        }
    }
}
