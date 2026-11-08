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
      await CrudService.createTable('drillings', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      easting INTEGER NOT NULL,
      northing INTEGER NOT NULL,
      elevation NUMERIC NOT NULL,
      tenement TEXT,
      landowner TEXT,
      start_date TEXT,
      end_date TEXT,
      responsible TEXT,      
      interruption_reason TEXT
    `);
    } catch (e) {
      console.error("MercadoInconfidentesCombustiveisInitializer.createCombustiveisTable")
      console.log(e)
    }
  }
}