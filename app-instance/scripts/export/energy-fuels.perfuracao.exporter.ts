import { DataExporter } from "@/core/types/data-exporter";
import * as ExportCsvService from '@/core/services/export-csv.service';

export class EnergyFuelsDrillingExporter implements DataExporter {
    async export(itemId: number): Promise<void> {
        try {
            const table = "drillings"
            const resultCsv = await ExportCsvService.exportTableToCSV('export', itemId);
            console.log(resultCsv);
            const resultImgs = await ExportCsvService.saveImagesFromTable('export_images', itemId);
            const resultZip = await ExportCsvService.exportZIP(resultCsv, `${table}.csv`, resultImgs);
            console.log(resultZip);
            // console.log(`Registro com ID ${id} removido com sucesso.`);
            // Alert.alert('Sucesso', `Registro com ID ${id} foi removido.`);
        } catch (error) {
            console.error('Erro ao exportar', error);
            // O tratamento de erro já está dentro do CrudService.delete
        }
    }
}
