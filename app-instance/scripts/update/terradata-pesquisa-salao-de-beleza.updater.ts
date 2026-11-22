import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaSalaoDeBelezaUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const salaoDeBeleza = this.extractSalaoDeBelezaInfo(info);
            await this.updateSalaoDeBeleza(salaoDeBeleza);

            console.log(`Registro com ID ${salaoDeBeleza!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateSalaoDeBeleza(data: any) {
        try {
            await CrudService.update('salao_de_beleza', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                corte_feminino: data.corte_feminino,
                depilacao_completa: data.depilacao_completa,
                escova: data.escova,
                escova_progressiva: data.escova_progressiva,
                hidratacao: data.hidratacao,
                manicure: data.manicure,
                manicure_e_pedicure: data.manicure_e_pedicure,
                maquiagem: data.maquiagem,
                pedicure: data.pedicure,
                reestruturacao_capilar: data.reestruturacao_capilar,
                spa_das_maos: data.spa_das_maos,
                spa_dos_pes: data.spa_dos_pes,
                tintura: data.tintura
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaUpdater.updateSalaoDeBeleza")
            console.log(e)
        }
    }

    private extractSalaoDeBelezaInfo(info: any) {
        try {
            return {
                id: info.id,
                estabelecimento: info.estabelecimento,
                data: info.data,
                corte_feminino: info.corte_feminino,
                depilacao_completa: info.depilacao_completa,
                escova: info.escova,
                escova_progressiva: info.escova_progressiva,
                hidratacao: info.hidratacao,
                manicure: info.manicure,
                manicure_e_pedicure: info.manicure_e_pedicure,
                maquiagem: info.maquiagem,
                pedicure: info.pedicure,
                reestruturacao_capilar: info.reestruturacao_capilar,
                spa_das_maos: info.spa_das_maos,
                spa_dos_pes: info.spa_dos_pes,
                tintura: info.tintura
            }
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaUpdater.extractSalaoDeBelezaInfo")
            console.log(e)
        }
    }
}
