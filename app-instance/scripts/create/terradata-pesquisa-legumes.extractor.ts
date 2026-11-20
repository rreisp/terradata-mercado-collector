import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaLegumesExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const legumes = this.extractLegumesInfo(info);
            await this.saveLegumes(legumes);

            const lastLegumesId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastLegumesId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaLegumesExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async saveLegumes(data: any) {
        try {
            await CrudService.insert('mercado_legumes', {
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
            });
        } catch (e) {
            console.error("TerradataPesquisaLegumesExtractor.saveLegumes")
            console.log(e)
        }
    }
    
    private extractLegumesInfo(info: any) {
        try {
            return {
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
            console.error("TerradataPesquisaLegumesExtractor.extractLegumesInfo")
            console.log(e)
        }
    }
}
