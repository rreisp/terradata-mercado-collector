import { Identified } from "./identified";

export interface DataReader {
    read(language: string): Promise<Identified[]>;
    columns(): string[];
}