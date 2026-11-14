// default-extractor.ts
import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

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

            // console.log(combustiveis);
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
            await CrudService.insert('mercado_combustiveis', {
                estabelecimento: data.estabelecimento,
                etanol: data.etanol,
                gasolina: data.gasolina,
                gasolina_aditivada: data.gasolina_aditivada,
                gasolina_premium: data.gasolina_premium,
                diesel_s10: data.diesel_s10,
                diesel_s500: data.diesel_s500,
                arla: data.arla,
                data: data.data
            });
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExtractor.saveCombustiveis")
            console.log(e)
        }
    }
    
    private extractCombustiveisInfo(info: any) {
        try {
            return {
                estabelecimento: info.estabelecimento,
                etanol: info.etanol,
                gasolina: info.gasolina,
                gasolina_aditivada: info.gasolina_aditivada,
                gasolina_premium: info.gasolina_premium,
                diesel_s10: info.diesel_s10,
                diesel_s500: info.diesel_s500,
                arla: info.arla,
                data: info.data
            }
        } catch (e) {
            console.error("MercadoInconfidentesCombustiveisExtractor.extractCombustiveisInfo")
            console.log(e)
        }
    }
}
