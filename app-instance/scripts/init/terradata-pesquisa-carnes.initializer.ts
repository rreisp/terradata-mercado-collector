import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaCarnesInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createCarnesTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaCarnesInitializer.init");
      console.log(e);
    }
  }

  // -------------------------------------------------------------------
  private async createCarnesTable(): Promise<void> {
    try {
      await CrudService.createTable('mercado_carnes', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      acem REAL,
      alcatra REAL,
      carne_moida_bovina REAL,
      contrafile REAL,
      costela_bovina REAL,
      coxao_mole REAL,
      fraldinha REAL,
      musculo REAL,
      patinho REAL,
      picanha REAL,
      asa_de_frango REAL,
      coxa_de_frango REAL,
      file_de_peito_de_frango REAL,
      peito_de_frango REAL,
      sobrecoxa_de_frango REAL,
      costelinha_suina REAL,
      linguica_suina REAL,
      lombo_suino REAL,
      panceta_barriga_suina REAL,
      pernil_suino REAL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    `);
    } catch (e) {
      console.error("TerradataPesquisaCarnesInitializer.createCarnesTable");
      console.log(e);
    }
  }
}