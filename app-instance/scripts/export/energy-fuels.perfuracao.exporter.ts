import { DataExporter } from "@/core/types/data-exporter";
import * as ExportCsvService from '@/core/services/export-csv.service';
import { CrudService } from "@/core/services/crud.service";

export class EnergyFuelsDrillingExporter implements DataExporter {
    async export(itemId: number, language: string): Promise<void> {
        await this.createExportView(language)
        await this.createExportImagesView()
        try {
            const table = "drillings"
            const resultCsv = await ExportCsvService.exportTableToCSV('export', itemId);
            console.log(resultCsv);
            const resultImgs = await ExportCsvService.saveImagesFromTable('export_images', itemId);
            const resultZip = await ExportCsvService.exportZIP(resultCsv, `${table}.csv`, resultImgs);
            console.log(resultZip);
            // console.log(`Registro com ID ${id} removido com sucesso.`);
            // Alert.alert('Sucesso', `Registro com ID ${itemId} foi exportado.`);
        } catch (error) {
            console.error('Erro ao exportar', error);
        }
    }

    async exportAll(language: string) {
        // TODO
        function sleep(ms: number) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        await sleep(5000)
        console.log("Exportar xabla " + language);
    }

    // -------------------------------------------------------------------
    private async createExportView(language: string): Promise<void> {
        try {
            await CrudService.dropView("export");
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
              LEFT JOIN min_grainsize gi on gi.id = s.fgk_min_grainsize 
              LEFT JOIN max_grainsize ga on ga.id = s.fgk_min_grainsize               
              LEFT JOIN hardness h on h.id = s.fgk_hardness 
              LEFT JOIN induration i on i.id = s.fgk_induration 
              LEFT JOIN roundness r on r.id = s.fgk_roundness 
              LEFT JOIN wash w on w.id = s.fgk_wash;
            `;
            await CrudService.createView('export', sql);
        } catch (error) {
            console.log('erro ao criar a view ', error);
        }
    }

    private async createExportImagesView(): Promise<void> {
        await CrudService.dropView("export_images");
        try {
            const sql = `SELECT i.*,s.fgk_drilling AS d_id 
              FROM images i 
              LEFT JOIN segments s on i.fgk_segment = s.id
              `;
            await CrudService.createView('export_images', sql);
        } catch (error) {
            console.log('erro ao criar a view ', error);
        }
    }
}
