import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaCombustiveisReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_combustiveis"); 
    } catch (e) {
      console.error("TerradataPesquisaCombustiveisReseter.reset")
      console.log(e)
    }
  }
}