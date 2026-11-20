import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class TerradataPesquisaLegumesRemover implements DataRemover {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async remove(rootItemId: number): Promise<void> {
        try {
            await CrudService.delete('mercado_legumes', 'id = ?', [rootItemId]);

            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro removido.` : `Record removed.`
            );
        } catch (e) {
            console.error("TerradataPesquisaLegumesRemover.remove")
            console.log(e)
        }
    }
}
