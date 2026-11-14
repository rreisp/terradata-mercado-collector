import { Identified } from "@/core/types/identified";

export type AdaptedCarnesRecord = Identified & {
    estabelecimento: string;
    data: string;
};