import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaFrutasReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_frutas"); 
    } catch (e) {
      console.error("TerradataPesquisaFrutasReseter.reset")
      console.log(e)
    }
  }
}
