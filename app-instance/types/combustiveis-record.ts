import { Identified } from "@/core/types/identified";

export type CombustiveisRecord = Identified & {
    titulo: string;
    etanol: number | null;
    gasolina: number | null;
    gasolina_aditivada: number | null;
    diesel_s10: number | null;
    diesel_s500: number | null;
    arla: number | null;
    data: string;
};