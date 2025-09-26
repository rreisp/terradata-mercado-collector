import { DataInitializer } from "@/core/types/data-initializer";
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingInitializer implements DataInitializer {
  async init(): Promise<void> {
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

    await this.createExportView();
    await new Promise(resolve => setTimeout(resolve, 100));
    await this.createExportImagesView();
    await new Promise(resolve => setTimeout(resolve, 100));
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
    const options = `id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT UNIQUE NOT NULL`;
    try {
      await CrudService.createTable('moisture', options);
      await CrudService.insertMultiple('moisture', [
        { 'description': 'Molhada' },
        { 'description': 'Úmida' },
        { 'description': 'Seca' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de umidade', error);
    }

    try {
      await CrudService.createTable('hardness', options);
      await CrudService.insertMultiple('hardness', [
        { 'description': 'Inconsolidada' },
        { 'description': 'Esmagável com o dedo' },
        { 'description': 'Nenhuma resistência a penetração' },
        { 'description': 'Resistência a penetração' },
        { 'description': 'Total resistência a penetração' }], 'description')
    } catch (error) {
      console.error('erro ao criar a tabela de opções de dureza', error);
    }

    try {
      await CrudService.createTable('wash', options);
      await CrudService.insertMultiple('wash', [
        { 'description': 'Fácil' },
        { 'description': 'Moderada' },
        { 'description': 'Difícil' },
        { 'description': 'Muito difícil' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de deslamagem', error);
    }

    try {
      await CrudService.createTable('color', options);
      await CrudService.insertMultiple('color', [
        { 'description': 'Clara' },
        { 'description': 'Escura' },
        { 'description': 'Preta' },
        { 'description': 'Marrom' },
        { 'description': 'Marrom alaranjada' },
        { 'description': 'Marrom avermelhada' },
        { 'description': 'Vermelha amarronzada' },
        { 'description': 'Vermelha' },
        { 'description': 'Rosa' },
        { 'description': 'Laranja avermelhada' },
        { 'description': 'Laranja amarronzada' },
        { 'description': 'Laranja' },
        { 'description': 'Laranja amarelada' },
        { 'description': 'Amarela' },
        { 'description': 'Amarelo amarronzado' },
        { 'description': 'Amarelo alaranjado' },
        { 'description': 'Beige' },
        { 'description': 'Creme' },
        { 'description': 'Cinza' },
        { 'description': 'Branco' },
        { 'description': 'Branco amarelado' },
        { 'description': 'Verde' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de cor', error);
    }

    try {
      await CrudService.createTable('induration', options);
      await CrudService.insertMultiple('induration', [
        { 'description': 'Calcária' },
        { 'description': 'Arenosa' },
        { 'description': 'Ferro' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de Cimentação', error);
    }

    try {
      await CrudService.createTable('grainsize', options);
      await CrudService.insertMultiple('grainsize', [
        { 'description': 'Muito fina' },
        { 'description': 'Fina' },
        { 'description': 'Média"' },
        { 'description': 'Grossa' },
        { 'description': 'Muito grossa' },
        { 'description': 'Cascalho' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de Granulometria', error);
    }

    try {
      await CrudService.createTable('sorting', options);
      await CrudService.insertMultiple('sorting', [
        { 'description': 'Muito fraca' },
        { 'description': 'Fraca' },
        { 'description': 'Moderada' },
        { 'description': 'Boa' },
        { 'description': 'Muito boa' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de seletividade granulométrica', error);
    }

    try {
      await CrudService.createTable('roundness', options);
      await CrudService.insertMultiple('roundness', [
        { 'description': 'Fraca' },
        { 'description': 'Moderada' },
        { 'description': 'Boa' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }

    try {
      await CrudService.createTable('lithology', options);
      await CrudService.insertMultiple('lithology', [
        { 'description': 'Grupo Barreiras' },
        { 'description': 'Argila' },
        { 'description': 'Argila arenosa' },
        { 'description': 'Silte' },
        { 'description': 'Areia argilosa' },
        { 'description': 'Areia siltosa' },
        { 'description': 'Areia' },
        { 'description': 'Areia cascalhosa' },
        { 'description': 'Solo' },
        { 'description': 'Calcário' },
        { 'description': 'Rocha' }], 'description');
    } catch (error) {
      console.error('erro ao criar a tabela de opções de esfericidade', error);
    }
  }

  // -------------------------------------------------------------------
  private async createExportView(): Promise<void> {
    try {
      const sql = `
            SELECT l.*, 
              d.id AS d_id, 
              d.title,
              d.easting ,
              d.elevation ,
              d.tenement ,
              d.landowner ,
              d.start_date ,
              d.end_date ,
              d.interruption_reason,
              s.*,
              m.description AS umidade, 
              c.description AS cor,
              g.description AS granulometria,
              h.description AS dureza,
              i.description AS cimentacao,
              r.description AS esfericidade,
              s2.description AS seletividade_granulometrica,
              w.description AS deslamagem
              FROM 
              lithologies l 
              LEFT JOIN lithology l2 on l.fgk_lithology_type = l2.id
              LEFT JOIN segments s on s.id =l.fgk_segment 
              LEFT JOIN drillings d on d.id = s.fgk_drilling  
              LEFT JOIN moisture m on s.fgk_moisture =m.id 
              LEFT JOIN color c on c.id = s.fgk_color 
              LEFT JOIN grainsize g on g.id = s.fgk_grainsize 
              LEFT JOIN hardness h on h.id = s.fgk_grainsize 
              LEFT JOIN induration i on i.id = s.fgk_induration 
              LEFT JOIN roundness r on r.id = s.fgk_roundness 
              LEFT JOIN sorting s2 on s2.id = s.fgk_sorting 
              LEFT JOIN wash w on w.id = s.fgk_wash;
            `;
      CrudService.createView('export', sql);
    } catch (error) {
      console.log('erro ao criar a view ', error);
    }
  }

  private async createExportImagesView(): Promise<void> {
    try {
      const sql = `SELECT i.*,s.fgk_drilling AS d_id 
              FROM images i 
              LEFT JOIN segments s on i.fgk_segment = s.id
              `;
      CrudService.createView('export_images', sql);
    } catch (error) {
      console.log('erro ao criar a view ', error);
    }
  }
}