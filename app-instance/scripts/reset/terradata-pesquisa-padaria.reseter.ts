import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaPadariaReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_padaria"); 
    } catch (e) {
      console.error("TerradataPesquisaPadariaReseter.reset")
      console.log(e)
    }
  }
}
