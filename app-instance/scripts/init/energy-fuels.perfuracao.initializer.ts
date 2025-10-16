import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingInitializer implements DataInitializer {
  async init(): Promise<void> {
    await CrudService.drop("drillings");
    await CrudService.drop("segments");
    await CrudService.drop("images");
    await CrudService.drop("lithologies");

    await CrudService.drop("moisture");
    await CrudService.drop("hardness");
    await CrudService.drop("wash");
    await CrudService.drop("color");
    await CrudService.drop("induration");
    await CrudService.drop("min_grainsize");
    await CrudService.drop("max_grainsize");
    await CrudService.drop("roundness");
    await CrudService.drop("lithology");

    await this.createDrillingsTable();
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createSegmentsTable();
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createImagesTable();
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createLithologiesTable();

    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createOptionsTables();
    await new Promise(resolve => setTimeout(resolve, 100));

    // await this.createExportView();
    // await new Promise(resolve => setTimeout(resolve, 100));
    // await this.createExportImagesView();
    // await new Promise(resolve => setTimeout(resolve, 100));
  }

  // -------------------------------------------------------------------
  private async createDrillingsTable(): Promise<void> {
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
      interruption_reason TEXT
    `);
      // console.log('Tabela drillings criada (ou já existia).');
    } catch (error) {
      console.error('Erro ao criar a tabela drillings:', error);
    }
  }

  // -------------------------------------------------------------------
  private async createSegmentsTable(): Promise<void> {
    try {
      await CrudService.createTable('segments', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_drilling INTEGER NOT NULL,
      depth_from NUMERIC NOT NULL,
      depth_to NUMERIC NOT NULL,
      recovery NUMERIC NOT NULL,
      fgk_moisture INTEGER NOT NULL,
      fgk_hardness INTEGER NOT NULL,
      fgk_wash INTEGER NOT NULL,
      fgk_color INTEGER NOT NULL,
      fgk_induration INTEGER NOT NULL,
      fgk_min_grainsize INTEGER NOT NULL,
      fgk_max_grainsize INTEGER NOT NULL,
      fgk_roundness INTEGER NOT NULL,
      clay NUMERIC NOT NULL,
      micah NUMERIC NOT NULL,
      shells NUMERIC NOT NULL,
      organic_matter NUMERIC NOT NULL,
      lithic_fragments NUMERIC NOT NULL,
      hms NUMERIC NOT NULL,
      comments TEXT,
      FOREIGN KEY (fgk_drilling) REFERENCES drillings(id)
    `);
      // console.log('Tabela segments criada (ou já existia).');
    } catch (error) {
      console.error('Erro ao criar a tabela segments:', error);
    }
  }

  // -------------------------------------------------------------------
  private async createImagesTable(): Promise<void> {
    try {
      await CrudService.createTable('images', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_segment INTEGER NOT NULL,
      img TEXT,
      FOREIGN KEY (fgk_segment) REFERENCES segments(id)      
    `);
      // console.log('Tabela images criada (ou já existia).');
    } catch (error) {
      console.error('Erro ao criar a tabela images:', error);
    }
  }

  // -------------------------------------------------------------------
  private async createLithologiesTable(): Promise<void> {
    try {
      await CrudService.createTable('lithologies', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_segment INTEGER NOT NULL,
      depth_from NUMERIC NOT NULL,
      depth_to NUMERIC NOT NULL,
      fgk_lithology_type INTEGER NOT NULL,
      FOREIGN KEY (fgk_segment) REFERENCES segments(id)
    `);
      // console.log('Tabela lithologies criada (ou já existia).');
    } catch (error) {
      console.error('Erro ao criar a tabela lithologies:', error);
    }
  }

  // -------------------------------------------------------------------
  private async createOptionsTables(): Promise<void> {
    const options = `id INTEGER PRIMARY KEY AUTOINCREMENT, ptBR TEXT UNIQUE NOT NULL, enUS TEXT UNIQUE NOT NULL`;
    try {
      await CrudService.createTable('moisture', options);
      await CrudService.insertMultiple('moisture', [
        { 'ptBR': 'Molhada', 'enUS': 'Wet' },
        { 'ptBR': 'Úmida', 'enUS': 'Moist' },
        { 'ptBR': 'Seca', 'enUS': 'Dry' }], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de umidade', error);
    }

    try {
      await CrudService.createTable('hardness', options);
      await CrudService.insertMultiple('hardness', [
        { 'ptBR': 'Inconsolidada', 'enUS': 'Unconsolidated' },
        { 'ptBR': 'Esmagável com o dedo', 'enUS': 'Crushable with finger' },
        { 'ptBR': 'Nenhuma resistência a penetração', 'enUS': 'No resistance to penetration' },
        { 'ptBR': 'Resistência a penetração', 'enUS': 'Resistance to penetration' },
        { 'ptBR': 'Total resistência a penetração', 'enUS': 'Total resistance to penetration' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de dureza', error);
    }

    try {
      await CrudService.createTable('wash', options);
      await CrudService.insertMultiple('wash', [
        { 'ptBR': 'Fácil', 'enUS': 'Easy' },
        { 'ptBR': 'Moderada', 'enUS': 'Moderate' },
        { 'ptBR': 'Difícil', 'enUS': 'Hard' },
        { 'ptBR': 'Muito difícil', 'enUS': 'Very hard' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de deslamagem', error);
    }

    try {
      await CrudService.createTable('color', options);
      await CrudService.insertMultiple('color', [
        { "ptBR": "Clara", "enUS": "Light" },
        { "ptBR": "Escura", "enUS": "Dark" },
        { "ptBR": "Preta", "enUS": "Black" },
        { "ptBR": "Marrom", "enUS": "Brown" },
        { "ptBR": "Marrom alaranjada", "enUS": "Orange-brown" },
        { "ptBR": "Marrom avermelhada", "enUS": "Reddish brown" },
        { "ptBR": "Vermelha amarronzada", "enUS": "Brownish red" },
        { "ptBR": "Vermelha", "enUS": "Red" },
        { "ptBR": "Rosa", "enUS": "Pink" },
        { "ptBR": "Laranja avermelhada", "enUS": "Reddish orange" },
        { "ptBR": "Laranja amarronzada", "enUS": "Brownish orange" },
        { "ptBR": "Laranja", "enUS": "Orange" },
        { "ptBR": "Laranja amarelada", "enUS": "Yellowish orange" },
        { "ptBR": "Amarela", "enUS": "Yellow" },
        { "ptBR": "Amarelo amarronzada", "enUS": "Brownish yellow" },
        { "ptBR": "Amarelo alaranjada", "enUS": "Orange-yellow" },
        { "ptBR": "Bege", "enUS": "Beige" },
        { "ptBR": "Creme", "enUS": "Cream" },
        { "ptBR": "Cinza", "enUS": "Gray" },
        { "ptBR": "Branco", "enUS": "White" },
        { "ptBR": "Branca Amarelada", "enUS": "Yellowish white" },
        { "ptBR": "Verde", "enUS": "Green" },
        { "ptBR": "Cinza Clara", "enUS": "Light gray" },
        { "ptBR": "Cinza Escura", "enUS": "Dark gray" },
        { "ptBR": "Marrom Clara", "enUS": "Light brown" },
        { "ptBR": "Marrom Escura", "enUS": "Dark brown" },
        { "ptBR": "Vermelha Clara", "enUS": "Light red" },
        { "ptBR": "Rosa Clara", "enUS": "Light pink" },
        { "ptBR": "Laranja Clara", "enUS": "Light orange" },
        { "ptBR": "Amarela Clara", "enUS": "Light yellow" },
        { "ptBR": "Bege Clara", "enUS": "Light beige" },
        { "ptBR": "Cinza Amarronzada", "enUS": "Brownish gray" },
        { "ptBR": "Marrom Acizentada", "enUS": "Grayish brown" },
        { "ptBR": "Cinza Esverdeada", "enUS": "Greenish gray" },
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de cor', error);
    }

    try {
      await CrudService.createTable('induration', options);
      await CrudService.insertMultiple('induration', [
        { 'ptBR': 'Nenhuma', 'enUS': 'None' },
        { 'ptBR': 'Calcária', 'enUS': 'Calcareous' },
        { 'ptBR': 'Arenosa', 'enUS': 'Sandy' },
        { 'ptBR': 'Ferro', 'enUS': 'Iron' }
      ], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de Cimentação', error);
    }

    try {
      await CrudService.createTable('min_grainsize', options + ", position INTEGER");
      await CrudService.insertMultiple('min_grainsize', [
        { 'ptBR': 'Muito fina', 'enUS': 'Very fine', 'position': 1 },
        { 'ptBR': 'Fina', 'enUS': 'Fine', 'position': 2 },
        { 'ptBR': 'Média', 'enUS': 'Medium', 'position': 3 },
        { 'ptBR': 'Grossa', 'enUS': 'Coarse', 'position': 4 },
        { 'ptBR': 'Muito grossa', 'enUS': 'Very coarse', 'position': 5 },
        { 'ptBR': 'Cascalho', 'enUS': 'Gravel', 'position': 6 }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria Mínima', error);
    }

    try {
      await CrudService.createTable('max_grainsize', options + ", position INTEGER");
      await CrudService.insertMultiple('max_grainsize', [
        { 'ptBR': 'Muito fina', 'enUS': 'Very fine', 'position': 1 },
        { 'ptBR': 'Fina', 'enUS': 'Fine', 'position': 2 },
        { 'ptBR': 'Média', 'enUS': 'Medium', 'position': 3 },
        { 'ptBR': 'Grossa', 'enUS': 'Coarse', 'position': 4 },
        { 'ptBR': 'Muito grossa', 'enUS': 'Very coarse', 'position': 5 },
        { 'ptBR': 'Cascalho', 'enUS': 'Gravel', 'position': 6 }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria Máxima', error);
    }

    try {
      await CrudService.createTable('roundness', options);
      await CrudService.insertMultiple('roundness', [
        { 'ptBR': 'Fraca', 'enUS': 'Poor' },
        { 'ptBR': 'Moderada', 'enUS': 'Moderate' },
        { 'ptBR': 'Boa', 'enUS': 'Good' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }

    try {
      await CrudService.createTable('lithology', options);
      await CrudService.insertMultiple('lithology', [
        { 'ptBR': 'Grupo Barreiras', 'enUS': 'Barreiras Group' },
        { 'ptBR': 'Argila', 'enUS': 'Clay' },
        { 'ptBR': 'Argila arenosa', 'enUS': 'Sandy clay' },
        { 'ptBR': 'Silte', 'enUS': 'Silt' },
        { 'ptBR': 'Areia argilosa', 'enUS': 'Clayey sand' },
        { 'ptBR': 'Areia siltosa', 'enUS': 'Silty sand' },
        { 'ptBR': 'Areia', 'enUS': 'Sand' },
        { 'ptBR': 'Areia cascalhosa', 'enUS': 'Gravelly sand' },
        { 'ptBR': 'Solo', 'enUS': 'Soil' },
        { 'ptBR': 'Calcário', 'enUS': 'Limestone' },
        { 'ptBR': 'Rocha', 'enUS': 'Rock' }
      ], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de tipos de litologia', error);
    }
  }
}