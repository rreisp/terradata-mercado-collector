// default-extractor.ts
import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

function formatDate(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export class MercadoInconfidentesCombustiveisExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            // console.warn('Extract Info');
            // console.log(info);

            // informação básica da pesquisa
            const combustiveis = this.extractCombustiveisInfo(info);

            // console.log(drilling);
            await this.saveCombustiveis(combustiveis);

            const lastCombustiveisId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastCombustiveisId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExtractor.extract")
            console.log(e)
        }
    }

    // -----------------------------------------------------------
    private async saveCombustiveis(data: any) {
        try {
            await CrudService.insert('drillings', {
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
            });
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExtractor.saveCombustiveis")
            console.log(e)
        }
    }
    
    private extractCombustiveisInfo(info: any) {
        try {
            return {
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
            console.error("MercadoInconfidentesCombustiveisExtractor.extractCombustiveisInfo")
            console.log(e)
        }
    }
}
