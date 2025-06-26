import { CrudService } from '@/services/crud.service';

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

export async function createImagesTable(): Promise<void> {
    try {
        await CrudService.createTable('images', `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fgk_interval INTEGER,
      img TEXT
    `);
        console.log('Tabela images criada (ou já existia).');
    } catch (error) {
        console.error('Erro ao criar a tabela images:', error);
    }
}

export async function initDatabase(): Promise<void> {
    // await CrudService.drop("drillings");
    // await CrudService.drop("images");

    await createDrillingsTable();
    await new Promise(resolve => setTimeout(resolve, 100));
    await createImagesTable();
}