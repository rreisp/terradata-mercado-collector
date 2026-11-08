import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class MercadoInconfidentesCombustiveisReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("drillings"); 
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisReseter.reset")
      console.log(e)
    }
  }
}