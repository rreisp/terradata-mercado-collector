import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingInitializer implements DataInitializer {
  async init(): Promise<void> {
    try {
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
    } catch (e) {
      console.error("EnergyFuelsDrillingInitializer.init")
      console.log(e)
    }
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
    } catch (e) {
      console.error("EnergyFuelsDrillingInitializer.createDrillingsTable")
      console.log(e)
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
    } catch (e) {
      console.error("EnergyFuelsDrillingInitializer.createSegmentsTable")
      console.log(e)
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
    } catch (e) {
      console.error("EnergyFuelsDrillingInitializer.createImagesTable")
      console.log(e)
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
    } catch (e) {
      console.error("EnergyFuelsDrillingInitializer.createLithologiesTable")
      console.log(e)
    }
  }

  // -------------------------------------------------------------------
  private async createOptionsTables(): Promise<void> {
    const options = `id INTEGER PRIMARY KEY AUTOINCREMENT, ptBR TEXT UNIQUE NOT NULL, enUS TEXT UNIQUE NOT NULL, code TEXT UNIQUE NOT NULL`;
    try {
      await CrudService.createTable('moisture', options);
      await CrudService.insertMultiple('moisture', [
        { 'ptBR': 'Molhada', 'enUS': 'Wet', 'code': 'W' },
        { 'ptBR': 'Úmida', 'enUS': 'Moist', 'code': 'M' },
        { 'ptBR': 'Seca', 'enUS': 'Dry', 'code': 'D' }], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de umidade', error);
    }

    try {
      await CrudService.createTable('hardness', options);
      await CrudService.insertMultiple('hardness', [
        { 'ptBR': 'Inconsolidada', 'enUS': 'Unconsolidated', 'code': '1' },
        { 'ptBR': 'Esmagável com o dedo', 'enUS': 'Crushable with finger', 'code': '2' },
        { 'ptBR': 'Nenhuma resistência a penetração', 'enUS': 'No resistance to penetration', 'code': '3' },
        { 'ptBR': 'Resistência a penetração', 'enUS': 'Resistance to penetration', 'code': '4' },
        { 'ptBR': 'Total resistência a penetração', 'enUS': 'Refusal', 'code': '5' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de dureza', error);
    }

    try {
      await CrudService.createTable('wash', options);
      await CrudService.insertMultiple('wash', [
        { 'ptBR': 'Fácil', 'enUS': 'Easy', 'code': 'E' },
        { 'ptBR': 'Moderada', 'enUS': 'Moderate', 'code': 'M' },
        { 'ptBR': 'Difícil', 'enUS': 'Hard', 'code': 'H' },
        { 'ptBR': 'Muito difícil', 'enUS': 'Very difficult', 'code': 'VD' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de deslamagem', error);
    }

    try {
      await CrudService.createTable('color', options);
      await CrudService.insertMultiple('color', [
        { "ptBR": "Clara", "enUS": "Light", "code": "L" },
        { "ptBR": "Escura", "enUS": "Dark", "code": "D" },
        { "ptBR": "Preta", "enUS": "Black", "code": "N" },
        { "ptBR": "Marrom", "enUS": "Brown", "code": "B" },
        { "ptBR": "Marrom Acinzentada", "enUS": "Brown Grey", "code": "BG" },
        { "ptBR": "Marrom alaranjada", "enUS": "Brown Orange", "code": "BO" },
        { "ptBR": "Marrom avermelhada", "enUS": "Brown Red", "code": "BR" },
        { "ptBR": "Vermelha amarronzada", "enUS": "Red Brown", "code": "RB" },
        { "ptBR": "Vermelha", "enUS": "Red", "code": "R" },
        { "ptBR": "Rosa", "enUS": "Pink", "code": "P" },
        { "ptBR": "Laranja avermelhada", "enUS": "Orange Red", "code": "OR" },
        { "ptBR": "Laranja amarronzada", "enUS": "Orange Brown", "code": "OB" },
        { "ptBR": "Laranja", "enUS": "Orange", "code": "O" },
        { "ptBR": "Laranja amarelada", "enUS": "Orange Yellow", "code": "OY" },
        { "ptBR": "Amarela", "enUS": "Yellow", "code": "Y" },
        { "ptBR": "Amarelo amarronzado", "enUS": "Yellow Brown", "code": "YB" },
        { "ptBR": "Amarelo alaranjado", "enUS": "Yellow Orange", "code": "YO" },
        { "ptBR": "Bege", "enUS": "Khaki", "code": "K" },
        { "ptBR": "Creme", "enUS": "Cream", "code": "C" },
        { "ptBR": "Cinza", "enUS": "Grey", "code": "G" },
        { "ptBR": "Cinza amarelado", "enUS": "Yellowish Grey", "code": "GI" },
        { "ptBR": "Cinza alaranjado", "enUS": "Orange Gray", "code": "GO" },
        { "ptBR": "Cinza azulado", "enUS": "Bluish Gray", "code": "CA" },
        { "ptBR": "Cinza amarronzado", "enUS": "Grey Brown", "code": "GB" },
        { "ptBR": "Marrom esverdeado", "enUS": "Greenish Brown", "code": "BV" },
        { "ptBR": "Marrom amarelado", "enUS": "Yellowish Brown", "code": "MA" },
        { "ptBR": "Branco", "enUS": "White", "code": "W" },
        { "ptBR": "Branco amarelado", "enUS": "White Yellow", "code": "WY" },
        { "ptBR": "Verde", "enUS": "Green", "code": "V" },
        { "ptBR": "Verde acinzentado", "enUS": "Green Grey", "code": "VG" }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de cor', error);
    }

    try {
      await CrudService.createTable('induration', options);
      await CrudService.insertMultiple('induration', [
        { 'ptBR': 'Nenhuma', 'enUS': 'None', 'code': 'N' },
        { 'ptBR': 'Calcária', 'enUS': 'Limestone', 'code': 'LST' },
        { 'ptBR': 'Arenosa', 'enUS': 'Sandystone', 'code': 'SST' },
        { 'ptBR': 'Ferro', 'enUS': 'Fe cemented SST', 'code': 'FST' }
      ], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de Cimentação', error);
    }

    try {
      await CrudService.createTable('min_grainsize', options + ", position INTEGER");
      await CrudService.insertMultiple('min_grainsize', [
        { 'ptBR': 'Muito fina', 'enUS': 'Very fine', 'code': 'VF', 'position': 1 },
        { 'ptBR': 'Fina', 'enUS': 'Fine', 'code': 'F', 'position': 2 },
        { 'ptBR': 'Média', 'enUS': 'Medium', 'code': 'M', 'position': 3 },
        { 'ptBR': 'Grossa', 'enUS': 'Coarse', 'code': 'C', 'position': 4 },
        { 'ptBR': 'Muito grossa', 'enUS': 'Very coarse', 'code': 'VC', 'position': 5 },
        { 'ptBR': 'Gânulo', 'enUS': 'Granule', 'code': 'GR', 'position': 6 },
        { 'ptBR': 'Cascalho', 'enUS': 'Gravel', 'code': 'PB', 'position': 7 }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria Mínima', error);
    }

    try {
      await CrudService.createTable('max_grainsize', options + ", position INTEGER");
      await CrudService.insertMultiple('max_grainsize', [
        { 'ptBR': 'Muito fina', 'enUS': 'Very fine', 'code': 'VF', 'position': 1 },
        { 'ptBR': 'Fina', 'enUS': 'Fine', 'code': 'F', 'position': 2 },
        { 'ptBR': 'Média', 'enUS': 'Medium', 'code': 'M', 'position': 3 },
        { 'ptBR': 'Grossa', 'enUS': 'Coarse', 'code': 'C', 'position': 4 },
        { 'ptBR': 'Muito grossa', 'enUS': 'Very coarse', 'code': 'VC', 'position': 5 },
        { 'ptBR': 'Gânulo', 'enUS': 'Granule', 'code': 'GR', 'position': 6 },
        { 'ptBR': 'Cascalho', 'enUS': 'Gravel', 'code': 'PB', 'position': 7 }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria Máxima', error);
    }

    try {
      await CrudService.createTable('sorting', options);
      await CrudService.insertMultiple('sorting', [
        { 'ptBR': 'Muito fraca', 'enUS': 'Very poor', 'code': 'VP' },
        { 'ptBR': 'Fraca', 'enUS': 'Poor', 'code': 'P' },
        { 'ptBR': 'Moderada', 'enUS': 'Moderate', 'code': 'M' },
        { 'ptBR': 'Boa', 'enUS': 'Well', 'code': 'W' },
        { 'ptBR': 'Muito boa', 'enUS': 'Very well', 'code': 'VW' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }

    try {
      await CrudService.createTable('lithology', options);
      await CrudService.insertMultiple('lithology', [
        { "ptBR": "Grupo Barreiras", "enUS": "Barreiras Group", "code": "BG" },
        { "ptBR": "Argila", "enUS": "Clay", "code": "CL" },
        { "ptBR": "Argila arenosa", "enUS": "Sandy Clay", "code": "SC" },
        { "ptBR": "Silte", "enUS": "Silt", "code": "SI" },
        { "ptBR": "Argila Siltosa", "enUS": "Silty clay", "code": "AL" },
        { "ptBR": "Silte argiloso", "enUS": "Clayey Silt", "code": "LA" },
        { "ptBR": "Silte arenoso", "enUS": "Sandy Silt", "code": "LS" },
        { "ptBR": "Areia argilosa", "enUS": "Clayey Sand", "code": "CS" },
        { "ptBR": "Areia siltosa", "enUS": "Silty Sand", "code": "SS" },
        { "ptBR": "Areia", "enUS": "Sand", "code": "SA" },
        { "ptBR": "Areia granular", "enUS": "Granular sand", "code": "SG" },
        { "ptBR": "Areia cascalhosa", "enUS": "Gravelly sand", "code": "GS" },
        { "ptBR": "Solo", "enUS": "Soil", "code": "SO" },
        { "ptBR": "Calcário", "enUS": "Limestone", "code": "CA" },
        { "ptBR": "Rocha", "enUS": "Rock", "code": "RK" }
      ], 'ptBR');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de tipos de litologia', error);
    }

    try {
      await CrudService.createTable('roundness', options);
      await CrudService.insertMultiple('roundness', [
        { 'ptBR': 'Angular', 'enUS': 'Angular', 'code': 'A' },
        { 'ptBR': 'Sub-angular', 'enUS': 'Sub-angular', 'code': 'SA' },
        { 'ptBR': 'Sub-rounded', 'enUS': 'Sub-rounded', 'code': 'SR' },
        { 'ptBR': 'Arredondada', 'enUS': 'Rounded', 'code': 'R' }
      ], 'ptBR');

    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }
    
  }
}