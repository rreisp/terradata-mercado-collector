import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingReseter implements DataReseter {
  async reset(): Promise<void> {
    CrudService.truncate("lithologies");
    CrudService.truncate("images");
    CrudService.truncate("segments");
    CrudService.truncate("drillings");
  }
}