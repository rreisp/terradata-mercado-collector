import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class MercadoInconfidentesCarnesReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_carnes"); 
    } catch (e) {
      console.error("MercadoInconfidentesCarnesReseter.reset");
      console.log(e);
    }
  }
}