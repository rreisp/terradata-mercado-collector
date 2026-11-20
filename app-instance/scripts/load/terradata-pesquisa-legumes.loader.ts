import { CrudService } from "@/core/services/crud.service";
import { DataLoader } from "@/core/types/data-loader";

export class TerradataPesquisaLegumesLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let legumes = null
        try {
            legumes = await this.loadLegumes(rootItemId);
        } catch (e) {
            console.error("TerradataPesquisaLegumesLoader.load")
            console.log(e)
        }
        
        return {
            "id": legumes!.id,
            "estabelecimento": legumes!.estabelecimento,
            "data": legumes!.data,
            "abobora_moranga": legumes!.abobora_moranga,
            "abobrinha": legumes!.abobrinha,
            "acelga": legumes!.acelga,
            "agriao": legumes!.agriao,
            "almeirao": legumes!.almeirao,
            "alface": legumes!.alface,
            "alho": legumes!.alho,
            "alho_poro": legumes!.alho_poro,
            "batata_baroa": legumes!.batata_baroa,
            "batata_doce_roxa": legumes!.batata_doce_roxa,
            "batata_inglesa": legumes!.batata_inglesa,
            "berinjela": legumes!.berinjela,
            "beterraba": legumes!.beterraba,
            "brocolis": legumes!.brocolis,
            "cebola_amarela": legumes!.cebola_amarela,
            "cebola_roxa": legumes!.cebola_roxa,
            "cebolinha": legumes!.cebolinha,
            "cenoura_vermelha": legumes!.cenoura_vermelha,
            "chuchu": legumes!.chuchu,
            "couve": legumes!.couve,
            "couve_flor": legumes!.couve_flor,
            "gengibre": legumes!.gengibre,
            "inhame": legumes!.inhame,
            "jilo": legumes!.jilo,
            "mandioca": legumes!.mandioca,
            "pepino": legumes!.pepino,
            "pimentao_verde": legumes!.pimentao_verde,
            "quiabo": legumes!.quiabo,
            "repolho": legumes!.repolho,
            "rucula": legumes!.rucula,
            "salsinha": legumes!.salsinha,
            "tomate_italiano": legumes!.tomate_italiano,
            "vagem": legumes!.vagem
        };
    }

    // -----------------------------------------------------------
    private async loadLegumes(itemId: number) {
        let legumes = null
        try {
            legumes = (await CrudService.list<any>(
                "mercado_legumes",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("TerradataPesquisaLegumesLoader.loadLegumes")
            console.log(e)
        }
        return legumes;
    }
}
