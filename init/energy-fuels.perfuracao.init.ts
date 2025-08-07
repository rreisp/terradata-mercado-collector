import { CrudService } from '@/services/crud.service';

// -------------------------------------------------------------------
export async function createDrillingsTable(): Promise<void> {
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
    console.log('Tabela drillings criada (ou já existia).');
  } catch (error) {
    console.error('Erro ao criar a tabela drillings:', error);
  }
}

// -------------------------------------------------------------------
export async function createSegmentsTable(): Promise<void> {
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
    console.log('Tabela segments criada (ou já existia).');
  } catch (error) {
    console.error('Erro ao criar a tabela segments:', error);
  }
}

// -------------------------------------------------------------------
export async function createImagesTable(): Promise<void> {
  try {
    await CrudService.createTable('images', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_segment INTEGER NOT NULL,
      img TEXT,
      FOREIGN KEY (fgk_segment) REFERENCES segments(id)      
    `);
    console.log('Tabela images criada (ou já existia).');
  } catch (error) {
    console.error('Erro ao criar a tabela images:', error);
  }
}

// -------------------------------------------------------------------
export async function createLithologiesTable(): Promise<void> {
  try {
    await CrudService.createTable('lithologies', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_segment INTEGER NOT NULL,
      depth_from NUMERIC NOT NULL,
      depth_to NUMERIC NOT NULL,
      fgk_lithology_type INTEGER NOT NULL,
      FOREIGN KEY (fgk_segment) REFERENCES segments(id)
    `);
    console.log('Tabela lithologies criada (ou já existia).');
  } catch (error) {
    console.error('Erro ao criar a tabela lithologies:', error);
  }
}


// -------------------------------------------------------------------
export async function initDatabase(): Promise<void> {
  // await CrudService.drop("drillings");
  // await CrudService.drop("segments");
  // await CrudService.drop("images");
  // await CrudService.drop("lithologies");

  await createDrillingsTable();
  await new Promise(resolve => setTimeout(resolve, 100));
  await createSegmentsTable();
  await new Promise(resolve => setTimeout(resolve, 100));
  await createImagesTable();
  await new Promise(resolve => setTimeout(resolve, 100));
  await createLithologiesTable();
}