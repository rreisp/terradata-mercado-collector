import { CrudService } from "@/core/services/crud.service";
import { DataLoader } from "@/core/types/data-loader";

export class TerradataPesquisaBarbeariaLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let barbearia = null
        try {
            barbearia = await this.loadBarbearia(rootItemId);
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaLoader.load")
            console.log(e)
        }
        
        return {
            "id": barbearia!.id,
            "estabelecimento": barbearia!.estabelecimento,
            "data": barbearia!.data,
            "barba": barbearia!.barba,
            "cabelo": barbearia!.cabelo
        };
    }

    // -----------------------------------------------------------
    private async loadBarbearia(itemId: number) {
        let barbearia = null
        try {
            barbearia = (await CrudService.list<any>(
                "barbearia",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("TerradataPesquisaBarbeariaLoader.loadBarbearia")
            console.log(e)
        }
        return barbearia;
    }
}
