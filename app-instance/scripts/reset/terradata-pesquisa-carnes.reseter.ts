import { DataReseter } from "@/core/types/data-reseter";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaCarnesReseter implements DataReseter {
  async reset(): Promise<void> {
    try {
      await CrudService.drop("mercado_carnes"); 
    } catch (e) {
      console.error("TerradataPesquisaCarnesReseter.reset");
      console.log(e);
    }
  }
}