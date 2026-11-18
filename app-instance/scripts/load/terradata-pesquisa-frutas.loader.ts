import { CrudService } from "@/core/services/crud.service";
import { DataLoader } from "@/core/types/data-loader";

export class TerradataPesquisaFrutasLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let frutas = null
        try {
            frutas = await this.loadFrutas(rootItemId);
        } catch (e) {
            console.error("TerradataPesquisaFrutasLoader.load")
            console.log(e)
        }
        
        return {
            "id": frutas!.id,
            "estabelecimento": frutas!.estabelecimento,
            "data": frutas!.data,
            "abacate": frutas!.abacate,
            "abacaxi": frutas!.abacaxi,
            "banana_caturra": frutas!.banana_caturra,
            "banana_prata": frutas!.banana_prata,
            "laranja_pera_rio": frutas!.laranja_pera_rio,
            "limao_tahiti": frutas!.limao_tahiti,
            "maca_fuji": frutas!.maca_fuji,
            "mamao_havai": frutas!.mamao_havai,
            "manga_palmer": frutas!.manga_palmer,
            "manga_tommy": frutas!.manga_tommy,
            "mexerica_ponkan": frutas!.mexerica_ponkan,
            "melancia": frutas!.melancia,
            "morango": frutas!.morango,
            "pera": frutas!.pera,
            "uva_italia": frutas!.uva_italia
        };
    }

    // -----------------------------------------------------------
    private async loadFrutas(itemId: number) {
        let frutas = null
        try {
            frutas = (await CrudService.list<any>(
                "mercado_frutas",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("TerradataPesquisaFrutasLoader.loadFrutas")
            console.log(e)
        }
        return frutas;
    }
}
