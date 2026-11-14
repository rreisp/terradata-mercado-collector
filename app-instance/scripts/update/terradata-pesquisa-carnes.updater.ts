import { DataUpdater } from "@/core/types/data-updater";
import { CrudService } from "@/core/services/crud.service";
import { Alert } from 'react-native';

export class TerradataPesquisaCarnesUpdater implements DataUpdater {
    private isPT: boolean;

    constructor(language: string) {
        this.isPT = language === 'pt-BR';
    }

    // -----------------------------------------------------------    
    async update(info: any): Promise<void> {
        try {
            const carnes = this.extractCarnesInfo(info);
            await this.updateCarnes(carnes);

            console.log(`Registro com ID ${carnes!.id} atualizado com sucesso.`);
            Alert.alert(
                this.isPT ? 'Sucesso' : 'Success',
                this.isPT ? `Registro atualizado.` : `Record updated.`
            );
        } catch (e) {
            console.error("TerradataPesquisaCarnesUpdater.update");
            console.log(e);
        }
    }

    // -----------------------------------------------------------
    private async updateCarnes(data: any) {
        try {
            await CrudService.update('mercado_carnes', {
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
            },
                "id = ?",
                [data.id]
            );
        } catch (e) {
            console.error("TerradataPesquisaCarnesUpdater.updateCarnes");
            console.log(e);
        }
    }

    private extractCarnesInfo(info: any) {
        try {
            return {
                id: info.id,
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
            console.error("TerradataPesquisaCarnesUpdater.extractCarnesInfo");
            console.log(e);
        }
    }
}