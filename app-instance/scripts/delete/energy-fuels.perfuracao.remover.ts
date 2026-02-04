import { CrudService } from "@/core/services/crud.service";
import { DataRemover } from "@/core/types/data-remover";
import { Alert } from "react-native";

export class EnergyFuelsDrillingRemover implements DataRemover {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    async remove(rootItemId: number): Promise<void> {
        interface DrillingSegmentDTO {
            id: number;
        }

        try {
            const fieldName = 'fgk_drilling';
            // recupera todos os segmentos relacionados a uma perfuração
            const drillingSegments = await CrudService.list('segments', {
                columns: ['id'],
                where: [`${fieldName} = ?`],
                params: [rootItemId]
            }) as DrillingSegmentDTO[];

            // apaga todas os registros de segmentos da perfuração incluindos as fotos e litologias associadas
            drillingSegments.forEach(async element => {
                console.warn(element.id);
                await CrudService.delete('images', 'fgk_segment = ?', [element.id]);
                await CrudService.delete('lithologies', 'fgk_segment = ?', [element.id]);                                         
                await CrudService.delete('segments', 'id = ?', [element.id]);
            });
            // apaga o registro principal da perfuração  
            await CrudService.delete('drillings', 'id = ?', [rootItemId]);

            console.log(`Registro com ID ${rootItemId} removido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro removido.` : `Record removed.`
            );
        } catch (e) {
            console.error("EnergyFuelsDrillingRemover.remove")
            console.log(e)
        }
    }
}