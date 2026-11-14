import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class MercadoInconfidentesCombustiveisRemover implements DataRemover {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async remove(rootItemId: number): Promise<void> {
        try {
            // apaga o registro principal da pesquisa  
            await CrudService.delete('mercado_combustiveis', 'id = ?', [rootItemId]);

            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro removido.` : `Record removed.`
            );
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisRemover.remove")
            console.log(e)
        }
    }
}