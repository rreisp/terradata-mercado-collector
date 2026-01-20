import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("images");
      await CrudService.drop("lithologies");
      await CrudService.drop("segments");
      await CrudService.drop("drillings");

      // await CrudService.drop("moisture");
      // await CrudService.drop("hardness");
      // await CrudService.drop("wash");
      // await CrudService.drop("color");
      // await CrudService.drop("induration");
      // await CrudService.drop("min_grainsize");
      // await CrudService.drop("max_grainsize");
      // await CrudService.drop("roundness");
      // await CrudService.drop("lithology");
    } catch (e) {
      console.error("EnergyFuelsDrillingReseter.reset")
      console.log(e)
    }
  }
}