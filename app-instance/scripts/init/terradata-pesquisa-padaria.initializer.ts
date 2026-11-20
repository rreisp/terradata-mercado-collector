import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaPadariaInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createPadariaTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaPadariaInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createPadariaTable(): Promise<void> {
    try {
      await CrudService.createTable('mercado_padaria', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      pao_frances REAL
    `);
    } catch (e) {
      console.error("TerradataPesquisaPadariaInitializer.createPadariaTable")
      console.log(e)
    }
  }
}
