import { DataExtractor } from "@/core/types/data-extractor";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaCarnesExtractor implements DataExtractor {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async extract(info: any): Promise<void> {
        try {
            const carnes = this.extractCarnesInfo(info);
            await this.saveCarnes(carnes);

            const lastCarnesId = await CrudService.lastInsertId();

            console.log(`Registro com ID ${lastCarnesId} inserido com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro criado.` : `Record created.`
            );
        } catch (e) {
            console.error("TerradataPesquisaCarnesExtractor.extract");
            console.log(e);
        }
    }

    // -----------------------------------------------------------
    private async saveCarnes(data: any) {
        console.log('-----', data.data)
        try {
            await CrudService.insert('mercado_carnes', {
                estabelecimento: data.estabelecimento,
                data: data.data,
                acem: data.acem,
                alcatra: data.alcatra,
                carne_moida_bovina: data.carne_moida_bovina,
                contrafile: data.contrafile,
                costela_bovina: data.costela_bovina,
                coxao_mole: data.coxao_mole,
                fraldinha: data.fraldinha,
                musculo: data.musculo,
                patinho: data.patinho,
                picanha: data.picanha,
                asa_de_frango: data.asa_de_frango,
                coxa_de_frango: data.coxa_de_frango,
                file_de_peito_de_frango: data.file_de_peito_de_frango,
                peito_de_frango: data.peito_de_frango,
                sobrecoxa_de_frango: data.sobrecoxa_de_frango,
                costelinha_suina: data.costelinha_suina,
                linguica_suina: data.linguica_suina,
                lombo_suino: data.lombo_suino,
                panceta_barriga_suina: data.panceta_barriga_suina,
                pernil_suino: data.pernil_suino
            });
        } catch (e) {
            console.error("TerradataPesquisaCarnesExtractor.saveCarnes");
            console.log(e);
        }
    }

    private extractCarnesInfo(info: any) {
        console.warn('aqui', info)
        try {
            return {
                estabelecimento: info.estabelecimento,
                data: info.data,
                acem: info.acem,
                alcatra: info.alcatra,
                carne_moida_bovina: info.carne_moida_bovina,
                contrafile: info.contrafile,
                costela_bovina: info.costela_bovina,
                coxao_mole: info.coxao_mole,
                fraldinha: info.fraldinha,
                musculo: info.musculo,
                patinho: info.patinho,
                picanha: info.picanha,
                asa_de_frango: info.asa_de_frango,
                coxa_de_frango: info.coxa_de_frango,
                file_de_peito_de_frango: info.file_de_peito_de_frango,
                peito_de_frango: info.peito_de_frango,
                sobrecoxa_de_frango: info.sobrecoxa_de_frango,
                costelinha_suina: info.costelinha_suina,
                linguica_suina: info.linguica_suina,
                lombo_suino: info.lombo_suino,
                panceta_barriga_suina: info.panceta_barriga_suina,
                pernil_suino: info.pernil_suino
            };
        } catch (e) {
            console.error("TerradataPesquisaCarnesExtractor.extractCarnesInfo");
            console.log(e);
        }
    }
}