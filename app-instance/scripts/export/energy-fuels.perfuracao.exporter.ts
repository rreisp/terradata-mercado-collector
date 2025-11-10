import { DataExporter } from "@/core/types/data-exporter";
import * as ExportCsvService from '@/core/services/export-csv.service';
import { CrudService } from "@/core/services/crud.service";
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";

// Interface para definir a estrutura dos arquivos CSV
interface CsvFile {
    path: string;
    fileName: string;
}

export type LanguageCode = "pt-BR" | "en-US";

export class EnergyFuelsDrillingExporter implements DataExporter {
    private language: string;
    private isPT: boolean;

    constructor(language: string) {
        this.language = language;
        this.isPT = language === 'pt-BR';
    }

    async export(itemId: number): Promise<void> {
        const lang = await this.selectLanguage(this.language);
        if (lang) {
            await this.createExportView(lang)
            await this.createExportImagesView()
            try {
                const table = "drillings"
                const resultCsv = await ExportCsvService.exportTableToCSV('export', itemId);
                console.log(resultCsv);
                const resultImgs = await ExportCsvService.saveImagesFromTable('export_images', itemId);
                const resultZip = await ExportCsvService.exportZIP(resultCsv, `${table}.csv`, resultImgs);
                console.log(resultZip);
                // console.log(`Registro com ID ${id} removido com sucesso.`);
                Alert.alert(
                    this.isPT ? 'Sucesso' : 'Success',
                    this.isPT ? `Registro exportado.` : `Record exported.`
                );
            } catch (error) {
                console.error(this.isPT ? 'Erro ao exportar' : 'Error while exporting', error);
            }
        }
    }

    async exportAll() {
        const lang = await this.selectLanguage(this.language);
        try {
            console.log(this.isPT ? "Iniciando processo de exportação completa..." : "Starting full export process...");

            // --- 1. Criar as Views e Gerar os Arquivos CSV ---
            await this.createExportSegmentsView(lang);
            await this.createExportDrillingsView(lang);
            await this.createExportLithologiesView(lang);
            await this.createExportImagesView(); // Se necessário

            const resultDrillings = await ExportCsvService.exportTableToCSV('drillingsExport', 0);
            const resultSegments = await ExportCsvService.exportTableToCSV('segmentsExport', 0);
            const resultLithologies = await ExportCsvService.exportTableToCSV('lithologiesExport', 0);

            // --- 2. Preparar a Lista de Arquivos para o ZIP ---
            // Assumindo que o resultado de exportTableToCSV tem uma propriedade 'uri' com o caminho do arquivo
            const csvFilesToZip: CsvFile[] = [
                { path: resultDrillings, fileName: 'drillings.csv' },
                { path: resultSegments, fileName: 'segments.csv' },
                { path: resultLithologies, fileName: 'lithologies.csv' },
            ];

            const resultImgs = await ExportCsvService.saveImagesFromTable('export_images', 0); //id = 0 para todas as imagens

            // --- 3. Chamar a Função para Gerar o ZIP ---
            console.log("Criando arquivo ZIP com todos os CSVs...");
            const zipFilePath = await ExportCsvService.exportAllZIP(csvFilesToZip, resultImgs);
            console.log(`Arquivo ZIP criado com sucesso em: ${zipFilePath}`);

            // --- 4. Excluir os Arquivos CSV Originais ---
            console.log("Excluindo arquivos CSV temporários...");
            for (const csvFile of csvFilesToZip) {
                try {
                    await FileSystem.deleteAsync(csvFile.path);
                    console.log(`Arquivo ${csvFile.fileName} excluído com sucesso.`);
                } catch (deleteError) {
                    console.error(`Falha ao excluir o arquivo ${csvFile.fileName}:`, deleteError);
                }
            }

            console.log("Processo de exportação finalizado.");
            // return zipFilePath;

        } catch (error) {
            console.error('Ocorreu um erro geral durante a exportação:', error);
        }
    }

    // -------------------------------------------------------------------  
    private selectLanguage(language: string): Promise<LanguageCode> {
        return new Promise((resolve) => {
            Alert.alert(
                this.isPT ? "Selecione o idioma" : "Select language",
                this.isPT ? "Escolha uma das opções abaixo:" : "Choose one of the options below:",
                [
                    {
                        text: this.isPT ? "🇺🇸  Inglês" : "🇺🇸  English",
                        onPress: () => resolve("en-US"),
                    },
                    {
                        text: this.isPT ? "🇧🇷  Português" : "🇧🇷  Portuguese",
                        onPress: () => resolve("pt-BR"),
                    },
                    // {
                    //     text: this.isPT ? "Cancelar" : "Cancel",
                    //     style: "cancel",
                    //     onPress: () => resolve(null),
                    // },
                ],
                { cancelable: false }
            );
        });
    }

    // -------------------------------------------------------------------
    private async createExportView(language: string): Promise<void> {
        language = language.replace('-', '');
        try {
            await CrudService.dropView("export");
            const sql = `
            SELECT 
              l.fgk_segment AS SEGMENT_ID,
              l.id AS ID_LITO,
              l.depth_from AS _FROM,
              l.depth_to AS _TO,
              l2.${language} AS LITHOLOGY_TYPE,
              d.id AS d_id, 
              d.title AS ID_HOLE ,
              d.easting AS EASTING ,
              d.elevation AS ELEVATION ,
              d.tenement AS MINING_TENEMENT,
              d.landowner AS LANDOWNER ,
              d.start_date AS BEGIN_DATE ,
              d.end_date AS END_DATE ,
              d.interruption_reason AS JUSTIFICATION ,
              s.clay AS CLAY,
              s.micah AS MICAH,
              s.shells AS SHELLS,
              s.organic_matter AS ORGANIC_MATTER,
              s.lithic_fragments AS LITHIC_FRAGMENTS,
              s.hms AS HMS,
              s.comments AS COMMENTS,
              m.${language} AS HUMIDITY, 
              c.${language} AS COLOR,
              gi.${language} AS MINIMUM_GRANULOMETRY,
              ga.${language} AS MAXIMUM_GRANULOMETRY,
              h.${language} AS HARDNESS,
              i.${language} AS INDURATION,
              r.${language} AS ROUDNESS,
              w.${language} AS WASH
              FROM 
              lithologies l 
              LEFT JOIN lithology l2 on l.fgk_lithology_type = l2.id
              LEFT JOIN segments s on s.id =l.fgk_segment 
              LEFT JOIN drillings d on d.id = s.fgk_drilling  
              LEFT JOIN moisture m on s.fgk_moisture =m.id 
              LEFT JOIN color c on c.id = s.fgk_color 
              LEFT JOIN min_grainsize gi on gi.id = s.fgk_min_grainsize 
              LEFT JOIN max_grainsize ga on ga.id = s.fgk_max_grainsize               
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

    private async createExportSegmentsView(language: string): Promise<void> {
        language = language.replace('-', '');
        try {
            await CrudService.dropView("segmentsExport");
            const sql = `
            SELECT 
                d.title AS ID_HOLE,
                s.id AS SEGMENT_ID,
                s.depth_from AS _FROM,
                s.depth_to AS _TO,
                s.recovery AS RECOVERY,
                h.${language} AS HARDNESS,
                w.${language} AS WASH,
                c.${language} AS COLOUR,
                i.${language} AS INDURATION,
                mg.${language} AS MINIMUM_GRANULOMETRY,
                mg2.${language} AS MAXIMUM_GRANULOMETRY,
                r.${language} AS ROUNDNESS,
                s.clay AS CLAY,
                s. micah AS MICAH,
                s.shells AS SHELLS,
                s.organic_matter AS ORGANIC_MATTER,
                s.lithic_fragments AS LITHIC_FRAGMENTS,
                s.hms AS HMS,
                s.comments AS COMMENTS
                FROM segments s
                LEFT JOIN drillings d ON s.fgk_drilling = d.id
                LEFT join moisture m on s.fgk_moisture =m.id 
                LEFT join color c on c.id = s.fgk_color 
                LEFT join min_grainsize mg on s.fgk_max_grainsize  = mg.id 
                LEFT JOIN max_grainsize mg2 ON s.fgk_max_grainsize = mg2.id 
                LEFT join hardness h on h.id = s.fgk_hardness 
                LEFT join induration i on i.id = s.fgk_induration 
                LEFT join roundness r on r.id = s.fgk_roundness 
                LEFT join wash w on w.id = s.fgk_wash;
            `;
            await CrudService.createView('segmentsExport', sql);
        } catch (error) {
            console.log('erro ao criar a view segmentsExport ', error);
        }
    }

    private async createExportDrillingsView(language: string): Promise<void> {
        language = language.replace('-', '');
        try {
            await CrudService.dropView("drillingsExport");
            const sql = `
            SELECT 
                d.title AS ID_HOLE,
                d.easting AS EASTING,
                d.northing AS NORTHING,
                d.elevation AS ELEVATION,
                d.tenement AS MINING_TENEMENT,
                d.landowner AS LANDOWNER,
                d.start_date AS BEGIN_DATE,
                d.end_date AS END_DATE,
                d.interruption_reason AS JUSTIFICATION
                FROM drillings d 
                ORDER BY d.title;
            `;
            await CrudService.createView('drillingsExport', sql);
        } catch (error) {
            console.log('erro ao criar a view drillingsExport ', error);
        }
    }

    private async createExportLithologiesView(language: string): Promise<void> {
        const normalizedLang = language.replace('-', '');
        const viewName = "lithologiesExport";

        try {
            // Remove a view se já existir (ignora o erro se não existir)
            await CrudService.dropView(viewName).catch(() => { });

            // Cria a query de forma clara e sem vírgulas sobrando
            const sql = `
            SELECT 
                d.title AS DRILLING_ID,
                s.id AS SEGMENT_ID,
                l.id AS ID_LITO,
                l.depth_from AS _FROM,
                l.depth_to AS _TO,
                l2.${normalizedLang} AS LITHOLOGY_TYPE
            FROM lithologies l
            LEFT JOIN segments s ON l.fgk_segment = s.id 
            LEFT JOIN drillings d ON s.fgk_drilling = d.id 
            LEFT JOIN lithology l2 ON l2.id = l.fgk_lithology_type
            ORDER BY d.title, d.id;
        `;

            await CrudService.createView(viewName, sql);
        } catch (error) {
            console.error(`Erro ao criar a view ${viewName}:`, error);
        }
    }

    private async createExportImagesView(): Promise<void> {
        await CrudService.dropView("export_images");
        try {
            const sql = `SELECT i.*,d.title AS ID_HOLE,  s.fgk_drilling AS d_id 
              FROM images i 
              LEFT JOIN segments s on i.fgk_segment = s.id
			  LEFT JOIN drillings d on d.id = s.fgk_drilling
              `;
            await CrudService.createView('export_images', sql);
        } catch (error) {
            console.log('erro ao criar a view ', error);
        }
    }
}
