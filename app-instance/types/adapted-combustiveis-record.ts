import { Identified } from "@/core/types/identified";

export type AdaptedCombustiveisRecord = Identified & {
    estabelecimento: string;
    data: string;
};