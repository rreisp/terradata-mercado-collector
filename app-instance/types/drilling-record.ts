import { Identified } from "@/core/types/identified";

export type CombustiveisRecord = Identified & {
    title: string;
    easting: number;
    northing: number;
    elevation: number;
    tenement: string;
    landowner: string;
    start_date: string;
    end_date: string;
    interrupted: number;
    interruption_reason: string;
};