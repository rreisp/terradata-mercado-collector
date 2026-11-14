import { CrudService } from "@/core/services/crud.service";
import { CombustiveisRecord } from "@/app-instance/types/combustiveis-record";
import { DataLoader } from "@/core/types/data-loader";

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export class MercadoInconfidentesCombustiveisLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let combustiveis = null
        try {
            combustiveis = await this.loadCombustiveis(rootItemId);
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisLoader.load")
            console.log(e)
        }
        
        return {
            "id": combustiveis!.id,
            "estabelecimento": combustiveis!.estabelecimento,
            "etanol": combustiveis!.etanol,
            "gasolina": combustiveis!.gasolina,
            "gasolina_aditivada": combustiveis!.gasolina_aditivada,
            "gasolina_premium": combustiveis!.gasolina_premium,
            "diesel_s10": combustiveis!.diesel_s10,
            "diesel_s500": combustiveis!.diesel_s500,
            "arla": combustiveis!.arla,
            "data": combustiveis!.data
        };
    }

    // -----------------------------------------------------------
    private async loadCombustiveis(itemId: number) {
        let combustiveis = null
        try {
            combustiveis = (await CrudService.list<CombustiveisRecord>(
                "mercado_combustiveis",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisLoader.loadCombustiveis")
            console.log(e)
        }
        return combustiveis;
    }
}
