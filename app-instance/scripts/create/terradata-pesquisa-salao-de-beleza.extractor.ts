import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaSalaoDeBelezaExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const salaoDeBeleza = this.extractSalaoDeBelezaInfo(info);
            await this.saveSalaoDeBeleza(salaoDeBeleza);

            const lastSalaoDeBelezaId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastSalaoDeBelezaId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async saveSalaoDeBeleza(data: any) {
        try {
            await CrudService.insert('salao_de_beleza', {
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
            });
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaExtractor.saveSalaoDeBeleza")
            console.log(e)
        }
    }
    
    private extractSalaoDeBelezaInfo(info: any) {
        try {
            return {
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
            console.error("TerradataPesquisaSalaoDeBelezaExtractor.extractSalaoDeBelezaInfo")
            console.log(e)
        }
    }
}
