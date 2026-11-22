import { CrudService } from "@/core/services/crud.service";
import { DataLoader } from "@/core/types/data-loader";

export class TerradataPesquisaSalaoDeBelezaLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let salaoDeBeleza = null
        try {
            salaoDeBeleza = await this.loadSalaoDeBeleza(rootItemId);
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaLoader.load")
            console.log(e)
        }
        
        return {
            "id": salaoDeBeleza!.id,
            "estabelecimento": salaoDeBeleza!.estabelecimento,
            "data": salaoDeBeleza!.data,
            "corte_feminino": salaoDeBeleza!.corte_feminino,
            "depilacao_completa": salaoDeBeleza!.depilacao_completa,
            "escova": salaoDeBeleza!.escova,
            "escova_progressiva": salaoDeBeleza!.escova_progressiva,
            "hidratacao": salaoDeBeleza!.hidratacao,
            "manicure": salaoDeBeleza!.manicure,
            "manicure_e_pedicure": salaoDeBeleza!.manicure_e_pedicure,
            "maquiagem": salaoDeBeleza!.maquiagem,
            "pedicure": salaoDeBeleza!.pedicure,
            "reestruturacao_capilar": salaoDeBeleza!.reestruturacao_capilar,
            "spa_das_maos": salaoDeBeleza!.spa_das_maos,
            "spa_dos_pes": salaoDeBeleza!.spa_dos_pes,
            "tintura": salaoDeBeleza!.tintura
        };
    }

    // -----------------------------------------------------------
    private async loadSalaoDeBeleza(itemId: number) {
        let salaoDeBeleza = null
        try {
            salaoDeBeleza = (await CrudService.list<any>(
                "salao_de_beleza",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("TerradataPesquisaSalaoDeBelezaLoader.loadSalaoDeBeleza")
            console.log(e)
        }
        return salaoDeBeleza;
    }
}
