import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaSalaoDeBelezaReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("salao_de_beleza"); 
    } catch (e) {
      console.error("TerradataPesquisaSalaoDeBelezaReseter.reset")
      console.log(e)
    }
  }
}
