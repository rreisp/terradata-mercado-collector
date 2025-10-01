import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingInitializer implements DataInitializer {
  async init(): Promise<void> {
    CrudService.drop("moisture");
    CrudService.drop("hardness");
    CrudService.drop("wash");
    CrudService.drop("color");
    CrudService.drop("induration");
    CrudService.drop("grainsize");
    CrudService.drop("sorting");
    CrudService.drop("roundness");
    CrudService.drop("lithology");

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
      volume NUMERIC NOT NULL,
      fgk_hardness INTEGER NOT NULL,
      fgk_wash INTEGER NOT NULL,
      fgk_color INTEGER NOT NULL,
      fgk_induration INTEGER NOT NULL,
      fgk_grainsize INTEGER NOT NULL,
      fgk_sorting INTEGER NOT NULL,
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
    const options = `id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT UNIQUE NOT NULL, ptBR TEXT UNIQUE NOT NULL, enUS TEXT UNIQUE NOT NULL`;
    try {
      await CrudService.createTable('moisture', options);
      await CrudService.insertMultiple('moisture', [
        { 'description': 'Molhada', 'ptBR': 'Molhada', 'enUS': 'Wet' },
        { 'description': 'Úmida', 'ptBR': 'Úmida', 'enUS': 'Moist' },
        { 'description': 'Seca', 'ptBR': 'Seca', 'enUS': 'Dry' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de umidade', error);
    }

    try {
      await CrudService.createTable('hardness', options);
      await CrudService.insertMultiple('hardness', [
        { 'description': 'Inconsolidada', 'ptBR': 'Inconsolidada', 'enUS': 'Unconsolidated' },
        { 'description': 'Esmagável com o dedo', 'ptBR': 'Esmagável com o dedo', 'enUS': 'Crushable with finger' },
        { 'description': 'Nenhuma resistência a penetração', 'ptBR': 'Nenhuma resistência a penetração', 'enUS': 'No resistance to penetration' },
        { 'description': 'Resistência a penetração', 'ptBR': 'Resistência a penetração', 'enUS': 'Resistance to penetration' },
        { 'description': 'Total resistência a penetração', 'ptBR': 'Total resistência a penetração', 'enUS': 'Total resistance to penetration' }
      ], 'description');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de dureza', error);
    }

    try {
      await CrudService.createTable('wash', options);
      await CrudService.insertMultiple('wash', [
        { 'description': 'Fácil', 'ptBR': 'Fácil', 'enUS': 'Easy' },
        { 'description': 'Moderada', 'ptBR': 'Moderada', 'enUS': 'Moderate' },
        { 'description': 'Difícil', 'ptBR': 'Difícil', 'enUS': 'Hard' },
        { 'description': 'Muito difícil', 'ptBR': 'Muito difícil', 'enUS': 'Very hard' }
      ], 'description');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de deslamagem', error);
    }

    try {
      await CrudService.createTable('color', options);
      await CrudService.insertMultiple('color', [
        { "description": "Clara", "ptBR": "Clara", "enUS": "Light" },
        { "description": "Escura", "ptBR": "Escura", "enUS": "Dark" },
        { "description": "Preta", "ptBR": "Preta", "enUS": "Black" },
        { "description": "Marrom", "ptBR": "Marrom", "enUS": "Brown" },
        { "description": "Marrom alaranjada", "ptBR": "Marrom alaranjada", "enUS": "Orange-brown" },
        { "description": "Marrom avermelhada", "ptBR": "Marrom avermelhada", "enUS": "Reddish brown" },
        { "description": "Vermelha amarronzada", "ptBR": "Vermelha amarronzada", "enUS": "Brownish red" },
        { "description": "Vermelha", "ptBR": "Vermelha", "enUS": "Red" },
        { "description": "Rosa", "ptBR": "Rosa", "enUS": "Pink" },
        { "description": "Laranja avermelhada", "ptBR": "Laranja avermelhada", "enUS": "Reddish orange" },
        { "description": "Laranja amarronzada", "ptBR": "Laranja amarronzada", "enUS": "Brownish orange" },
        { "description": "Laranja", "ptBR": "Laranja", "enUS": "Orange" },
        { "description": "Laranja amarelada", "ptBR": "Laranja amarelada", "enUS": "Yellowish orange" },
        { "description": "Amarela", "ptBR": "Amarela", "enUS": "Yellow" },
        { "description": "Amarela amarronzada", "ptBR": "Amarelo amarronzada", "enUS": "Brownish yellow" },
        { "description": "Amarela alaranjada", "ptBR": "Amarelo alaranjada", "enUS": "Orange-yellow" },
        { "description": "Beige", "ptBR": "Bege", "enUS": "Beige" },
        { "description": "Creme", "ptBR": "Creme", "enUS": "Cream" },
        { "description": "Cinza", "ptBR": "Cinza", "enUS": "Gray" },
        { "description": "Branca", "ptBR": "Branco", "enUS": "White" },
        { "description": "Branca amarelada", "ptBR": "Branca Amarelada", "enUS": "Yellowish white" },
        { "description": "Verde", "ptBR": "Verde", "enUS": "Green" },
        { "description": "Cinza clara", "ptBR": "Cinza Clara", "enUS": "Light gray" },
        { "description": "Cinza escura", "ptBR": "Cinza Escura", "enUS": "Dark gray" },
        { "description": "Marrom clara", "ptBR": "Marrom Clara", "enUS": "Light brown" },
        { "description": "Marrom escura", "ptBR": "Marrom Escura", "enUS": "Dark brown" },
        { "description": "Vermelha clara", "ptBR": "Vermelha Clara", "enUS": "Light red" },
        { "description": "Rosa clara", "ptBR": "Rosa Clara", "enUS": "Light pink" },
        { "description": "Laranja clara", "ptBR": "Laranja Clara", "enUS": "Light orange" },
        { "description": "Amarela clara", "ptBR": "Amarela Clara", "enUS": "Light yellow" },
        { "description": "Amarela alaranjada", "ptBR": "Amarela Alaranjada", "enUS": "Orange-yellow" },
        { "description": "Bege clara", "ptBR": "Bege Clara", "enUS": "Light beige" },
        { "description": "Cinza amarronzada", "ptBR": "Cinza Amarronzada", "enUS": "Brownish gray" },
        { "description": "Marrom acizentada", "ptBR": "Marrom Acizentada", "enUS": "Grayish brown" },
        { "description": "Cinza esverdeada", "ptBR": "Cinza Esverdeada", "enUS": "Greenish gray" },
      ], 'description');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de cor', error);
    }

    try {
      await CrudService.createTable('induration', options);
      await CrudService.insertMultiple('induration', [
        { 'description': 'Calcária', 'ptBR': 'Calcária', 'enUS': 'Calcareous' },
        { 'description': 'Arenosa', 'ptBR': 'Arenosa', 'enUS': 'Sandy' },
        { 'description': 'Ferro', 'ptBR': 'Ferro', 'enUS': 'Iron' }
      ], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de Cimentação', error);
    }

    try {
      await CrudService.createTable('grainsize', options);
      await CrudService.insertMultiple('grainsize', [
        { 'description': 'Muito fina', 'ptBR': 'Muito fina', 'enUS': 'Very fine' },
        { 'description': 'Fina', 'ptBR': 'Fina', 'enUS': 'Fine' },
        { 'description': 'Média', 'ptBR': 'Média', 'enUS': 'Medium' },
        { 'description': 'Grossa', 'ptBR': 'Grossa', 'enUS': 'Coarse' },
        { 'description': 'Muito grossa', 'ptBR': 'Muito grossa', 'enUS': 'Very coarse' },
        { 'description': 'Cascalho', 'ptBR': 'Cascalho', 'enUS': 'Gravel' }
      ], 'description');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria', error);
    }

    try {
      await CrudService.createTable('sorting', options);
      await CrudService.insertMultiple('sorting', [
        { 'description': 'Muito fraca', 'ptBR': 'Muito fraca', 'enUS': 'Very poor' },
        { 'description': 'Fraca', 'ptBR': 'Fraca', 'enUS': 'Poor' },
        { 'description': 'Moderada', 'ptBR': 'Moderada', 'enUS': 'Moderate' },
        { 'description': 'Boa', 'ptBR': 'Boa', 'enUS': 'Good' },
        { 'description': 'Muito boa', 'ptBR': 'Muito boa', 'enUS': 'Very good' }
      ], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de seletividade granulométrica', error);
    }

    try {
      await CrudService.createTable('roundness', options);
      await CrudService.insertMultiple('roundness', [
        { 'description': 'Fraca', 'ptBR': 'Fraca', 'enUS': 'Poor' },
        { 'description': 'Moderada', 'ptBR': 'Moderada', 'enUS': 'Moderate' },
        { 'description': 'Boa', 'ptBR': 'Boa', 'enUS': 'Good' }
      ], 'description');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }

    try {
      await CrudService.createTable('lithology', options);
      await CrudService.insertMultiple('lithology', [
        { 'description': 'Grupo Barreiras', 'ptBR': 'Grupo Barreiras', 'enUS': 'Barreiras Group' },
        { 'description': 'Argila', 'ptBR': 'Argila', 'enUS': 'Clay' },
        { 'description': 'Argila arenosa', 'ptBR': 'Argila arenosa', 'enUS': 'Sandy clay' },
        { 'description': 'Silte', 'ptBR': 'Silte', 'enUS': 'Silt' },
        { 'description': 'Areia argilosa', 'ptBR': 'Areia argilosa', 'enUS': 'Clayey sand' },
        { 'description': 'Areia siltosa', 'ptBR': 'Areia siltosa', 'enUS': 'Silty sand' },
        { 'description': 'Areia', 'ptBR': 'Areia', 'enUS': 'Sand' },
        { 'description': 'Areia cascalhosa', 'ptBR': 'Areia cascalhosa', 'enUS': 'Gravelly sand' },
        { 'description': 'Solo', 'ptBR': 'Solo', 'enUS': 'Soil' },
        { 'description': 'Calcário', 'ptBR': 'Calcário', 'enUS': 'Limestone' },
        { 'description': 'Rocha', 'ptBR': 'Rocha', 'enUS': 'Rock' }
      ], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de tipos de litologia', error);
    }
  }
}