import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class MercadoInconfidentesCombustiveisInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createCombustiveisTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createCombustiveisTable(): Promise<void> {
    try {
      await CrudService.createTable('mercado_combustiveis', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      etanol REAL,
      gasolina REAL,
      gasolina_aditivada REAL,
      gasolina_premium REAL,      
      diesel_s10 REAL,
      diesel_s500 REAL,
      arla REAL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    `);
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisInitializer.createCombustiveisTable")
      console.log(e)
    }
  }
}