import { Identified } from "./identified";

export interface DataReader {
    read(): Promise<Identified[]>;
    columns(): string[];
}