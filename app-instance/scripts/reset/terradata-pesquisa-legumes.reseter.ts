import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaLegumesReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_legumes"); 
    } catch (e) {
      console.error("TerradataPesquisaLegumesReseter.reset")
      console.log(e)
    }
  }
}
