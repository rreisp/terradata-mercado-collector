import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class EnergyFuelsDrillingRemover implements DataRemover {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async remove(rootItemId: number): Promise<void> {
        try {
            await CrudService.delete('drillings', 'id = ?', [rootItemId]);
            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro removido.` : `Record removed.`
            );
        } catch (error) {
            console.error(this.isPT ? 'Erro ao remover o registro:' : 'Error while removing record:', error);
        }
    }
}