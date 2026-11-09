import { CrudService } from "@/core/services/crud.service";
import { CombustiveisRecord } from "@/app-instance/types/combustiveis-record";
import { DataLoader } from "@/core/types/data-loader";

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
}

export class MercadoInconfidentesCombustiveisLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        try {
            const combustiveis = await this.loadCombustiveis(rootItemId);

            return {
                "id": combustiveis.id,
                "titulo": combustiveis.titulo,
                "etanol": combustiveis.etanol,
                "gasolina": combustiveis.gasolina,
                "gasolina_aditivada": combustiveis.gasolina_aditivada,
                "gasolina_premium": combustiveis.gasolina_premium,
                "diesel_s10": combustiveis.diesel_s10,
                "diesel_s500": combustiveis.diesel_s500,
                "arla": combustiveis.arla,
                "data": combustiveis.data
            };
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisLoader.load")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async loadCombustiveis(itemId: number) {
        try {
            const drilling = (await CrudService.list<CombustiveisRecord>(
                "drillings",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
            return drilling;
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisLoader.loadCombustiveis")
            console.log(e)
        }
    }
}
