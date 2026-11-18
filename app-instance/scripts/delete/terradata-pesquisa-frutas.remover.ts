import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class TerradataPesquisaFrutasRemover implements DataRemover {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async remove(rootItemId: number): Promise<void> {
        try {
            await CrudService.delete('mercado_frutas', 'id = ?', [rootItemId]);

            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro removido.` : `Record removed.`
            );
        } catch (e) {
            console.error("TerradataPesquisaFrutasRemover.remove")
            console.log(e)
        }
    }
}
