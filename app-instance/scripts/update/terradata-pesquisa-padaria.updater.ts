import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaPadariaUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const padaria = this.extractPadariaInfo(info);
            await this.updatePadaria(padaria);

            console.log(`Registro com ID ${padaria!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaPadariaUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updatePadaria(data: any) {
        try {
            await CrudService.update('mercado_padaria', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                pao_frances: data.pao_frances
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaPadariaUpdater.updatePadaria")
            console.log(e)
        }
    }

    private extractPadariaInfo(info: any) {
        try {
            return {
                id: info.id,
                estabelecimento: info.estabelecimento,
                data: info.data,
                pao_frances: info.pao_frances
            }
        } catch (e) {
            console.error("TerradataPesquisaPadariaUpdater.extractPadariaInfo")
            console.log(e)
        }
    }
}
