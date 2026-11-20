import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class TerradataPesquisaLegumesInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
      await this.createLegumesTable();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (e) {
      console.error("TerradataPesquisaLegumesInitializer.init")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createLegumesTable(): Promise<void> {
    try {
      await CrudService.createTable('mercado_legumes', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      estabelecimento TEXT NOT NULL,
      data TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
      abobora_moranga REAL,
      abobrinha REAL,
      acelga REAL,
      agriao REAL,
      almeirao REAL,
      alface REAL,
      alho REAL,
      alho_poro REAL,
      batata_baroa REAL,
      batata_doce_roxa REAL,
      batata_inglesa REAL,
      berinjela REAL,
      beterraba REAL,
      brocolis REAL,
      cebola_amarela REAL,
      cebola_roxa REAL,
      cebolinha REAL,
      cenoura_vermelha REAL,
      chuchu REAL,
      couve REAL,
      couve_flor REAL,
      gengibre REAL,
      inhame REAL,
      jilo REAL,
      mandioca REAL,
      pepino REAL,
      pimentao_verde REAL,
      quiabo REAL,
      repolho REAL,
      rucula REAL,
      salsinha REAL,
      tomate_italiano REAL,
      vagem REAL
    `);
    } catch (e) {
      console.error("TerradataPesquisaLegumesInitializer.createLegumesTable")
      console.log(e)
    }
  }
}
