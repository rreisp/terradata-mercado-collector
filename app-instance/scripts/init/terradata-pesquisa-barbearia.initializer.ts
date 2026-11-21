import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaBarbeariaInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createBarbeariaTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaBarbeariaInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createBarbeariaTable(): Promise<void> {
    try {
      await CrudService.createTable('barbearia', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      barba REAL,
      cabelo REAL
    `);
    } catch (e) {
      console.error("TerradataPesquisaBarbeariaInitializer.createBarbeariaTable")
      console.log(e)
    }
  }
}
