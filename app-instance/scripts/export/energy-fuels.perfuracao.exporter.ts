import { DataExporter } from "@/core/types/data-exporter";
import { CrudService } from "@/core/services/crud.service";
import { CSVService } from "@/core/services/csv.service";
import { PDFService } from "@/core/services/pdf.service";
import { ZIPService } from '@/core/services/zip.service';
import * as FileSystem from 'expo-file-system';
import { Alert } from "react-native";
import { EnergyFuelsDrillingReport } from "@/app-instance/template/drilling-report";
import { CsvFile } from "@/core/types/data/csv-file";
import { LanguageCode } from "@/core/types/data/language-code";

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
            await this.createExportSegmentsView(lang);
            await this.createExportDrillingsView(lang);
            await this.createExportLithologiesView(lang);
            await this.createExportImagesView();
            try {
                const table = "drillings"
                // obtem o título do furo para nomear o arquivo
                const idHole = await CrudService.getTitleHole(itemId);

                // obter e preparar a lista de arquivos para o ZIP  
                const drillingsTempCSV = await CSVService.exportTableToCSV('drillingsExport', itemId);
                const segmentsTempCSV = await CSVService.exportTableToCSV('segmentsExport', itemId);
                const lithologiesTempCSV = await CSVService.exportTableToCSV('lithologiesExport', itemId);
                const resultImgs = await CSVService.saveImagesFromTable('export_images', itemId);

                const csvFilesToZip: CsvFile[] = [
                    { path: drillingsTempCSV, fileName: 'collars.csv' },
                    { path: segmentsTempCSV, fileName: 'drilling_logs.csv' },
                    { path: lithologiesTempCSV, fileName: 'lithologies.csv' },
                ];

                // gerar o ZIP
                const zipFilePath = await ZIPService.exportAllZIP(csvFilesToZip, resultImgs, idHole);
                // console.log(`Arquivo ZIP criado com sucesso em: ${zipFilePath}`);

                // excluir os arquivos CSV originais
                for (const csvFile of csvFilesToZip) {
                    try {
                        await FileSystem.deleteAsync(csvFile.path);
                        console.log(`Arquivo ${csvFile.fileName} excluído com sucesso.`);
                    } catch (deleteError) {
                        console.error(`Falha ao excluir o arquivo ${csvFile.fileName}:`, deleteError);
                    }

                    Alert.alert(
                        this.isPT ? 'Sucesso' : 'Success',
                        this.isPT ? `Registro exportado.` : `Record exported.`
                    );
                }
            } catch (error) {
                console.error(this.isPT ? 'Erro ao exportar' : 'Error while exporting', error);
            }
        }
    }

    async exportPDF(itemId: number): Promise<void> {
        const lang = await this.selectLanguage(this.language);
        if (lang) {
            try {
                // criar as views e gerar os arquivos CSV         
                await this.createExportSegmentsView(lang);
                await this.createExportDrillingsView(lang);
                await this.createExportLithologiesView(lang);
                await this.createExportImagesView();

                // obter os dados e preparar o relatório           
                const drillings = await PDFService.getData('drillingsExport', itemId);
                const segments = (await PDFService.getData('segmentsExport', 0)).filter(item => item.DRILLING_ID === itemId);
                const lithologies = await PDFService.getData('lithologiesExport', 0);
                const drillingReportDoc = new EnergyFuelsDrillingReport()
                drillingReportDoc.generate(lang, drillings![0], segments, lithologies)
            } catch (error) {
                console.error(this.isPT ? 'Erro ao exportar' : 'Error while exporting', error);
            }
        }
    }

    async exportAll() {
        const lang = await this.selectLanguage(this.language);
        try {
            console.log(this.isPT ? "Iniciando processo de exportação completa..." : "Starting full export process...");

            // criar as views e gerar os arquivos CSV    
            await this.createExportSegmentsView(lang);
            await this.createExportDrillingsView(lang);
            await this.createExportLithologiesView(lang);

            // obter e preparar a lista de arquivos para o ZIP              
            const drillingsTempCSV = await CSVService.exportTableToCSV('drillingsExport');
            const segmentsTempCSV = await CSVService.exportTableToCSV('segmentsExport');
            const lithologiesTempCSV = await CSVService.exportTableToCSV('lithologiesExport');

            // obter e preparar a lista de arquivos para o ZIP  
            const csvFilesToZip: CsvFile[] = [
                { path: drillingsTempCSV, fileName: 'collars.csv' },
                { path: segmentsTempCSV, fileName: 'drilling_logs.csv' },
                { path: lithologiesTempCSV, fileName: 'lithologies.csv' },
            ];

            // gerar o ZIP
            const zipFilePath = await ZIPService.exportAllZIP(csvFilesToZip);
            // console.log(`Arquivo ZIP criado com sucesso em: ${zipFilePath}`);

            // excluir os arquivos CSV originais
            for (const csvFile of csvFilesToZip) {
                try {
                    await FileSystem.deleteAsync(csvFile.path);
                    console.log(this.isPT ? `Arquivo ${csvFile.fileName} excluído com sucesso.` : `File ${csvFile.fileName} successfully deleted.`);
                } catch (deleteError) {
                    console.error(this.isPT ? `Falha ao excluir o arquivo ${csvFile.fileName}:` : `Failed to delete file ${csvFile.fileName}:`, deleteError);
                }
            }

            console.log("Processo de exportação finalizado.");

        } catch (error) {
            console.error(this.isPT ? 'Ocorreu um erro geral durante a exportação:' : 'A general error occurred during the export:', error);
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

    private async createExportSegmentsView(language: string): Promise<void> {
        language = language.replace('-', '');
        try {
            await CrudService.dropView("segmentsExport");
            const sql = `
            SELECT 
                d.title AS ID_HOLE,
                s.fgk_drilling AS DRILLING_ID,
                s.depth_from AS _FROM,
                s.depth_to AS _TO,
                s.recovery AS RECOVERY,
                m.${language} AS MOISTURE,
                h.${language} AS HARDNESS,
                w.${language} AS WASH,
                c.${language} AS COLOR,
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
                LEFT join min_grainsize mg on s.fgk_min_grainsize  = mg.id 
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
            const isEnglish = language.toLowerCase().includes('en');
            // se for Inglês converte para o padrão americano, senão mantém o formato original
            const beginDateColumn = isEnglish
                ? "(substr(d.start_date, 4, 2) || '/' || substr(d.start_date, 1, 2) || '/' || substr(d.start_date, 7, 4)) AS BEGIN_DATE"
                : "d.start_date AS BEGIN_DATE";

            const endDateColumn = isEnglish
                ? "(substr(d.end_date, 4, 2) || '/' || substr(d.end_date, 1, 2) || '/' || substr(d.end_date, 7, 4)) AS END_DATE"
                : "d.end_date AS END_DATE";

            const sql = `
            SELECT 
                d.title AS ID_HOLE,
                d.easting AS EASTING,
                d.northing AS NORTHING,
                d.elevation AS ELEVATION,
                d.tenement AS MINING_TENEMENT,
                d.landowner AS LANDOWNER,
                ${beginDateColumn},
                ${endDateColumn},
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
            const sql = `SELECT i.*,d.title AS ID_HOLE,  s.fgk_drilling AS d_id, s.depth_from, s.depth_to 
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
