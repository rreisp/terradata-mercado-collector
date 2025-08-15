import { Loader } from "@/types/loader";

export class EnergyFuelsDrillingLoader implements Loader {
    load(schemaId: string, itemId: number): { [key: string]: any } {
        console.log("Method not implemented.");
        console.log(schemaId, itemId);
        return {
            "title": "bronx",
            "ef_coordinates": {
                "easting": "1",
                "northing": "2",
                "elevation": "3"
            },
            "tenement": "TR123213",
            "landowner": "José"
        };
    }
}