import { Identified } from "@/core/types/identified";

export type CarnesRecord = Identified & {
    estabelecimento: string;
    data: string;
    acem: number | null;
    alcatra: number | null;
    carne_moida_bovina: number | null;
    contrafile: number | null;
    costela_bovina: number | null;
    coxao_mole: number | null;
    fraldinha: number | null;
    musculo: number | null;
    patinho: number | null;
    picanha: number | null;
    asa_de_frango: number | null;
    coxa_de_frango: number | null;
    file_de_peito_de_frango: number | null;
    peito_de_frango: number | null;
    sobrecoxa_de_frango: number | null;
    costelinha_suina: number | null;
    linguica_suina: number | null;
    lombo_suino: number | null;
    panceta_barriga_suina: number | null;
    pernil_suino: number | null;
};