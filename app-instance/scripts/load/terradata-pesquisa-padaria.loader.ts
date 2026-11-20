import { CrudService } from "@/core/services/crud.service";
import { DataLoader } from "@/core/types/data-loader";

export class TerradataPesquisaPadariaLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let padaria = null
        try {
            padaria = await this.loadPadaria(rootItemId);
        } catch (e) {
            console.error("TerradataPesquisaPadariaLoader.load")
            console.log(e)
        }
        
        return {
            "id": padaria!.id,
            "estabelecimento": padaria!.estabelecimento,
            "data": padaria!.data,
            "pao_frances": padaria!.pao_frances
        };
    }

    // -----------------------------------------------------------
    private async loadPadaria(itemId: number) {
        let padaria = null
        try {
            padaria = (await CrudService.list<any>(
                "mercado_padaria",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("TerradataPesquisaPadariaLoader.loadPadaria")
            console.log(e)
        }
        return padaria;
    }
}
