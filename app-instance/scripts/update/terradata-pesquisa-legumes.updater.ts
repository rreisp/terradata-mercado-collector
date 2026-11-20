import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaLegumesUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const legumes = this.extractLegumesInfo(info);
            await this.updateLegumes(legumes);

            console.log(`Registro com ID ${legumes!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaLegumesUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateLegumes(data: any) {
        try {
            await CrudService.update('mercado_legumes', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                abobora_moranga: data.abobora_moranga,
                abobrinha: data.abobrinha,
                acelga: data.acelga,
                agriao: data.agriao,
                almeirao: data.almeirao,
                alface: data.alface,
                alho: data.alho,
                alho_poro: data.alho_poro,
                batata_baroa: data.batata_baroa,
                batata_doce_roxa: data.batata_doce_roxa,
                batata_inglesa: data.batata_inglesa,
                berinjela: data.berinjela,
                beterraba: data.beterraba,
                brocolis: data.brocolis,
                cebola_amarela: data.cebola_amarela,
                cebola_roxa: data.cebola_roxa,
                cebolinha: data.cebolinha,
                cenoura_vermelha: data.cenoura_vermelha,
                chuchu: data.chuchu,
                couve: data.couve,
                couve_flor: data.couve_flor,
                gengibre: data.gengibre,
                inhame: data.inhame,
                jilo: data.jilo,
                mandioca: data.mandioca,
                pepino: data.pepino,
                pimentao_verde: data.pimentao_verde,
                quiabo: data.quiabo,
                repolho: data.repolho,
                rucula: data.rucula,
                salsinha: data.salsinha,
                tomate_italiano: data.tomate_italiano,
                vagem: data.vagem
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaLegumesUpdater.updateLegumes")
            console.log(e)
        }
    }

    private extractLegumesInfo(info: any) {
        try {
            return {
                id: info.id,
                estabelecimento: info.estabelecimento,
                data: info.data,
                abobora_moranga: info.abobora_moranga,
                abobrinha: info.abobrinha,
                acelga: info.acelga,
                agriao: info.agriao,
                almeirao: info.almeirao,
                alface: info.alface,
                alho: info.alho,
                alho_poro: info.alho_poro,
                batata_baroa: info.batata_baroa,
                batata_doce_roxa: info.batata_doce_roxa,
                batata_inglesa: info.batata_inglesa,
                berinjela: info.berinjela,
                beterraba: info.beterraba,
                brocolis: info.brocolis,
                cebola_amarela: info.cebola_amarela,
                cebola_roxa: info.cebola_roxa,
                cebolinha: info.cebolinha,
                cenoura_vermelha: info.cenoura_vermelha,
                chuchu: info.chuchu,
                couve: info.couve,
                couve_flor: info.couve_flor,
                gengibre: info.gengibre,
                inhame: info.inhame,
                jilo: info.jilo,
                mandioca: info.mandioca,
                pepino: info.pepino,
                pimentao_verde: info.pimentao_verde,
                quiabo: info.quiabo,
                repolho: info.repolho,
                rucula: info.rucula,
                salsinha: info.salsinha,
                tomate_italiano: info.tomate_italiano,
                vagem: info.vagem
            }
        } catch (e) {
            console.error("TerradataPesquisaLegumesUpdater.extractLegumesInfo")
            console.log(e)
        }
    }
}
