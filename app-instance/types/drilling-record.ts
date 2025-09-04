export type DrillingRecord = {
    id?: number;
    title: number;
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