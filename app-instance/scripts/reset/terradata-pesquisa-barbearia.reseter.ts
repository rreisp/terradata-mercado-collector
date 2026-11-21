import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaBarbeariaReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("barbearia"); 
    } catch (e) {
      console.error("TerradataPesquisaBarbeariaReseter.reset")
      console.log(e)
    }
  }
}
