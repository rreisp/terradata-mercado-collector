import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class EnergyFuelsDrillingRemover implements DataRemover {
    async remove(rootItemId: number): Promise<void> {
        console.warn(rootItemId);
        Alert.alert('Remover item', `ID do item: ${rootItemId}`);
        try {
            await CrudService.delete('drillings', 'id = ?', [rootItemId]);
            // setDrillings((prevDrillings) => prevDrillings.filter(drilling => drilling.id !== rootItemId));
            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert('Sucesso', `Registro com ID ${rootItemId} foi removido.`);
        } catch (error) {
            console.error('Erro ao remover o registro:', error);
            // O tratamento de erro já está dentro do CrudService.delete
        }
    }
}