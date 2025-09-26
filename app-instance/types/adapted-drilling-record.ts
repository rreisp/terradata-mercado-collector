import { Identified } from "@/core/types/identified";

export type AdaptedDrillingRecord = Identified & {
    title: string;
    dates: string;
};