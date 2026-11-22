import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaSalaoDeBelezaInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createSalaoDeBelezaTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaSalaoDeBelezaInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createSalaoDeBelezaTable(): Promise<void> {
    try {
      await CrudService.createTable('salao_de_beleza', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      corte_feminino REAL,
      depilacao_completa REAL,
      escova REAL,
      escova_progressiva REAL,
      hidratacao REAL,
      manicure REAL,
      manicure_e_pedicure REAL,
      maquiagem REAL,
      pedicure REAL,
      reestruturacao_capilar REAL,
      spa_das_maos REAL,
      spa_dos_pes REAL,
      tintura REAL
    `);
    } catch (e) {
      console.error("TerradataPesquisaSalaoDeBelezaInitializer.createSalaoDeBelezaTable")
      console.log(e)
    }
  }
}
