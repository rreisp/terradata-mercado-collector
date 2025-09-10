import { DataReader } from "@/core/types/data-reader";
import { CrudService } from "@/core/services/crud.service";
import { DrillingRecord } from "@/app-instance/types/drilling-record";
import { AdaptedDrillingRecord } from "@/app-instance/types/adapted-drilling-record";

export class EnergyFuelsDrillingReader implements DataReader {
  async read(): Promise<AdaptedDrillingRecord[]> {
    const drillings = await CrudService.list<DrillingRecord>('drillings');
    const adaptedDrillings = drillings.map((item) => ({
      id: item.id,
      title: item.title,
      dates: item.start_date +" a "+ item.end_date
    }));
    return adaptedDrillings;
  }
 
  columns(): string[] {
    // return ["title", "start_date", "dates"];
        return ["title", "dates"];
  }
}