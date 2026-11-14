import { CrudService } from "@/core/services/crud.service";
import { CarnesRecord } from "@/app-instance/types/carnes-record";
import { DataLoader } from "@/core/types/data-loader";

export class MercadoInconfidentesCarnesLoader implements DataLoader {
    async load(rootItemId: number): Promise<{ [key: string]: any }> {
        let carnes = null;
        try {
            carnes = await this.loadCarnes(rootItemId);
        } catch (e) {
            console.error("MercadoInconfidentesCarnesLoader.load");
            console.log(e);
        }

        return {
            "id": carnes!.id,
            "estabelecimento": carnes!.estabelecimento,
            "data": carnes!.data,
            "acem": carnes!.acem,
            "alcatra": carnes!.alcatra,
            "carne_moida_bovina": carnes!.carne_moida_bovina,
            "contrafile": carnes!.contrafile,
            "costela_bovina": carnes!.costela_bovina,
            "coxao_mole": carnes!.coxao_mole,
            "fraldinha": carnes!.fraldinha,
            "musculo": carnes!.musculo,
            "patinho": carnes!.patinho,
            "picanha": carnes!.picanha,
            "asa_de_frango": carnes!.asa_de_frango,
            "coxa_de_frango": carnes!.coxa_de_frango,
            "file_de_peito_de_frango": carnes!.file_de_peito_de_frango,
            "peito_de_frango": carnes!.peito_de_frango,
            "sobrecoxa_de_frango": carnes!.sobrecoxa_de_frango,
            "costelinha_suina": carnes!.costelinha_suina,
            "linguica_suina": carnes!.linguica_suina,
            "lombo_suino": carnes!.lombo_suino,
            "panceta_barriga_suina": carnes!.panceta_barriga_suina,
            "pernil_suino": carnes!.pernil_suino
        };
    }

    // -----------------------------------------------------------
    private async loadCarnes(itemId: number) {
        let carnes = null;
        try {
            carnes = (await CrudService.list<CarnesRecord>(
                "mercado_carnes",
                {
                    where: ["id = ?"],
                    params: [itemId]
                }
            ))[0];
        } catch (e) {
            console.error("MercadoInconfidentesCarnesLoader.loadCarnes");
            console.log(e);
        }
        return carnes;
    }
}