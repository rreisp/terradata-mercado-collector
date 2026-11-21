import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaBarbeariaUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const barbearia = this.extractBarbeariaInfo(info);
            await this.updateBarbearia(barbearia);

            console.log(`Registro com ID ${barbearia!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateBarbearia(data: any) {
        try {
            await CrudService.update('barbearia', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                barba: data.barba,
                cabelo: data.cabelo
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaUpdater.updateBarbearia")
            console.log(e)
        }
    }

    private extractBarbeariaInfo(info: any) {
        try {
            return {
                id: info.id,
                estabelecimento: info.estabelecimento,
                data: info.data,
                barba: info.barba,
                cabelo: info.cabelo
            }
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaUpdater.extractBarbeariaInfo")
            console.log(e)
        }
    }
}
