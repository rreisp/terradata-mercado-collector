// default-extractor.ts
import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export class MercadoInconfidentesCombustiveisUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            // informação básica da perfuração
            const drilling = this.extractCombustiveisInfo(info);
            // console.log(drilling);
            await this.updateCombustiveis(drilling);

            console.log(`Registro com ID ${drilling!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisUpdater.update")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async updateCombustiveis(data: any) {
        try {
            await CrudService.update('drillings', {
                title: data.title,
                easting: data.easting,
                northing: data.northing,
                elevation: data.elevation,
                tenement: data.tenement,
                landowner: data.landowner,
                start_date: data.start_date,
                end_date: data.end_date,
                responsible: data.responsible,
                interruption_reason: data.interruption_reason
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisUpdater.updateCombustiveis")
            console.log(e)
        }
    }

    private extractCombustiveisInfo(info: any) {
        try {
            return {
                id: info.id,
                title: info.title,
                easting: info.ef_coordinates.easting,
                northing: info.ef_coordinates.northing,
                elevation: info.ef_coordinates.elevation,
                tenement: info.tenement,
                landowner: info.landowner,
                start_date: formatDate(info.ef_dates.start),
                end_date: formatDate(info.ef_dates.end),
                responsible: info.responsible,
                interruption_reason: info.reason
            }
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisUpdater.extractCombustiveisInfo")
            console.log(e)
        }
    }
}
