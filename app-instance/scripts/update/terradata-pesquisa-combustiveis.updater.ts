// default-extractor.ts
import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export class TerradataPesquisaCombustiveisUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            // informação básica da perfuração
            const combustiveis = this.extractCombustiveisInfo(info);
            // console.log(combustiveis);
            await this.updateCombustiveis(combustiveis);

            console.log(`Registro com ID ${combustiveis!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateCombustiveis(data: any) {
        try {
            await CrudService.update('mercado_combustiveis', {
                estabelecimento: data.estabelecimento,
                etanol: data.etanol,
                gasolina: data.gasolina,
                gasolina_aditivada: data.gasolina_aditivada,
                gasolina_premium: data.gasolina_premium,
                diesel_s10: data.diesel_s10,
                diesel_s500: data.diesel_s500,
                arla: data.arla,
                data: data.data
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisUpdater.updateCombustiveis")
            console.log(e)
        }
    }

    private extractCombustiveisInfo(info: any) {
        try {
            return {
                id: info.id,
                estabelecimento: info.estabelecimento,
                etanol: info.etanol,
                gasolina: info.gasolina,
                gasolina_aditivada: info.gasolina_aditivada,
                gasolina_premium: info.gasolina_premium,
                diesel_s10: info.diesel_s10,
                diesel_s500: info.diesel_s500,
                arla: info.arla,
                data: info.data
            }
        } catch (e) {
            console.error("TerradataPesquisaCombustiveisUpdater.extractCombustiveisInfo")
            console.log(e)
        }
    }
}
