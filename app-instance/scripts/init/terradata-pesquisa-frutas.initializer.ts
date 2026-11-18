import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaFrutasInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createFrutasTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaFrutasInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createFrutasTable(): Promise<void> {
    try {
      await CrudService.createTable('mercado_frutas', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      abacate REAL,
      abacaxi REAL,
      banana_caturra REAL,
      banana_prata REAL,
      laranja_pera_rio REAL,
      limao_tahiti REAL,
      maca_fuji REAL,
      mamao_havai REAL,
      manga_palmer REAL,
      manga_tommy REAL,
      mexerica_ponkan REAL,
      melancia REAL,
      morango REAL,
      pera REAL,
      uva_italia REAL
    `);
    } catch (e) {
      console.error("TerradataPesquisaFrutasInitializer.createFrutasTable")
      console.log(e)
    }
  }
}
