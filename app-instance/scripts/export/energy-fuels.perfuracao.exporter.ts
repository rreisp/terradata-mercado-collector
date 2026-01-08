import { DataExporter } from "@/core/types/data-exporter";
import { CrudService } from "@/core/services/crud.service";
import { CSVService } from "@/core/services/csv.service";
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
                const drillingsTempCSV = await this.exportTableToCSV('drillingsExport', itemId);
                const segmentsTempCSV = await this.exportTableToCSV('segmentsExport', itemId);
                const lithologiesTempCSV = await this.exportTableToCSV('lithologiesExport', itemId);
                const resultImgs = await this.saveImagesFromTable('export_images', itemId);

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
        try {
            const lang = await this.selectLanguage(this.language);
            if (lang) {
                // criar as views e gerar os arquivos CSV         
                await this.createExportSegmentsView(lang);
                await this.createExportDrillingsView(lang);
                await this.createExportLithologiesView(lang);
                await this.createExportImagesView();

                // obter os dados e preparar o relatório           
                const drillings = await this.getData('drillingsExport', itemId);
                const segments = (await this.getData('segmentsExport')).filter(item => item.DRILLING_ID === itemId);
                const lithologies = await this.getData('lithologiesExport');
                const drillingReportDoc = new EnergyFuelsDrillingReport(lang)
                drillingReportDoc.generate(drillings![0], segments, lithologies)
            }
        } catch (error) {
            console.error(this.isPT ? 'Erro ao exportar' : 'Error while exporting', error);
        }
    }

    async exportAll() {
        try {
            const lang = await this.selectLanguage(this.language);
            // console.log(this.isPT ? "Iniciando processo de exportação completa..." : "Starting full export process...");

            // criar as views e gerar os arquivos CSV    
            await this.createExportSegmentsView(lang);
            await this.createExportDrillingsView(lang);
            await this.createExportLithologiesView(lang);

            // obter e preparar a lista de arquivos para o ZIP              
            const drillingsTempCSV = await this.exportTableToCSV('drillingsExport');
            const segmentsTempCSV = await this.exportTableToCSV('segmentsExport');
            const lithologiesTempCSV = await this.exportTableToCSV('lithologiesExport');

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
        try {
            language = language.replace('-', '');
            await CrudService.dropView("segmentsExport");
            const sql = `
            SELECT 
                d.title AS ID_HOLE,
                s.fgk_drilling AS DRILLING_ID,
                s.id AS SEGMENT_ID,
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
                ORDER BY d.title, s.depth_from;
            `;
            await CrudService.createView('segmentsExport', sql);
        } catch (error) {
            console.log('erro ao criar a view segmentsExport ', error);
        }
    }

    private async createExportDrillingsView(language: string): Promise<void> {
        try {
            language = language.replace('-', '');
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
        try {
            const normalizedLang = language.replace('-', '');
            const viewName = "lithologiesExport";

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
        try {
            await CrudService.dropView("export_images");
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


    // ---------------------------------------------------------------
    // ---------------------------------------------------------------
    // ---------------------------------------------------------------    
    /**
     * @private
     * Busca dados de uma tabela filtrando pelo título/nome do Furo.
     * Mapeia a função original `getTableData2`.
     * @param tableName Nome da tabela.
     * @param title Título/Nome do Furo a ser filtrado.
     * @returns Array de objetos com os dados filtrados.
     */
    private async getTableDataByHoleTitle(tableName: string, title: string): Promise<any[]> {
        let fieldName = 'ID_HOLE';
        // Lógica para determinar o campo de filtro com base no nome da tabela
        if (tableName === 'lithologiesExport') {
            fieldName = 'DRILLING_ID';
        }

        // Chamada ao CrudService
        // const result = CrudService.list(tableName, [fieldName], [title]);
        const result = await CrudService.list(tableName, {
            where: [`${fieldName} = ?`],
            params: [title]
        });
        return result;
    }

    /**
     * @private
     * Busca todos os dados de uma tabela.
     * Mapeia a função original `getAllTableData`.
     * @param tableName Nome da tabela.
     * @returns Array de objetos com todos os dados da tabela.
     */
    private async getAllTableData(tableName: string): Promise<any[]> {
        // Chamada ao CrudService sem filtros
        const result = await CrudService.list(tableName, {});
        return result;
    }

    /**
     * Função principal para buscar dados da tabela.
     * Se um 'id' for fornecido (d_id), busca os dados filtrados pelo nome do furo.
     * Caso contrário, busca todos os dados da tabela.
     * Mapeia a função original `getData`.
     * * @param tableName Nome da tabela a ser consultada.
     * @param id ID do registro principal (d_id). Se 0, busca todos os dados.
     * @returns Promise que resolve com um array de objetos (dados da tabela).
     */
    public async getData(tableName: string, id: number = 0): Promise<any[]> {

        if (id !== 0) {
            // Lógica para buscar dados de um furo específico (ID !== 0)
            try {
                // 1. Obter o título/nome do furo usando o ID principal
                const idHole = await CrudService.getTitleHole(id);

                // 2. Buscar dados da tabela filtrando pelo nome do furo
                const data = await this.getTableDataByHoleTitle(tableName, idHole);
                return data;

            } catch (error) {
                console.error(`Erro ao buscar dados para o ID ${id} na tabela ${tableName}:`, error);
                // Re-lança o erro para ser tratado pela camada superior
                throw error;
            }

        } else {
            // Lógica para buscar todos os dados (ID === 0)
            try {
                const data = await this.getAllTableData(tableName);
                return data;
            } catch (error) {
                console.error(`Erro ao buscar todos os dados da tabela ${tableName}:`, error);
                throw error;
            }
        }
    }

    /**
     * Exporta os dados de uma tabela para um arquivo CSV.
     * O nome do arquivo incluirá o ID do furo se fornecido.
     * @param tableName Nome da tabela a ser exportada.
     * @param d_id ID (d_id) da tabela principal opcional (se 0, exporta tudo).
     * @returns Promise que resolve com a URI do arquivo CSV.
     */
    public async exportTableToCSV(tableName: string, d_id: number = 0): Promise<string> {
        let data: any[];
        let filename: string;

        try {
            if (d_id !== 0) {
                // 1. Obter o título do furo
                const idHole = await CrudService.getTitleHole(d_id);
                // 2. Obter dados filtrados pelo título/nome do furo
                data = await this.getTableDataByHoleTitle(tableName, idHole);
                filename = `${tableName}_${idHole}.csv`;
            } else {
                // 1. Obter todos os dados da tabela
                data = await this.getTableData(tableName);
                filename = `${tableName}.csv`;
            }

            if (data.length === 0) {
                console.log(`A tabela '${tableName}' não possui dados para exportar.`);
                // Cria arquivo vazio para consistência ou lança erro, dependendo da necessidade
                // Aqui, vamos salvar um arquivo vazio.
            }

            // 3. Converter para CSV
            const csv = CSVService.convertToCSV(data);

            // 4. Salvar o arquivo
            const fileUri = await CSVService.saveCSVFile(filename, csv);

            console.log(`Arquivo CSV salvo: ${fileUri}`);
            return fileUri;

        } catch (error) {
            console.error(`Erro ao exportar tabela '${tableName}':`, error);
            throw error;
        }
    }

    /**
     * @private
     * Retorna dados de uma tabela com filtro por d_id ou sem filtro.
     * Mapeia as funções originais `getTableData`, `getTableData2` e `getAllTableData`.
     * @param tableName Nome da tabela.
     * @param id ID do furo (d_id) opcional para filtrar dados.
     * @returns Array de objetos com os dados da tabela.
     */
    private async getTableData(tableName: string, id?: number): Promise<any[]> {
        if (id) {
            // Lógica original de getTableData
            // const result = CrudService.list(tableName, ["d_id="], [id], orderBy);
            // Assumindo que CrudService.list lida com a busca
            const result = await CrudService.list(tableName, {
                where: ["d_id = ?"],
                params: [id]
            });
            return result;
        } else {
            // Lógica original de getAllTableData
            const result = await CrudService.list(tableName, {});
            return result;
        }
    }


    /**
     * Busca dados de imagem (base64) de uma tabela e salva as imagens como arquivos JPG.
     * Mapeia a função original `saveImagesFromTable`.
     * @param tableName Nome da tabela que contém os dados da imagem (coluna 'img').
     * @param tableId ID da tabela principal opcional para filtro.
     * @returns Promise que resolve com um array de caminhos dos arquivos JPG salvos.
     */
    public async saveImagesFromTable(tableName: string, tableId: number): Promise<string[]> {
        const savedFilePaths: string[] = [];
        const savePromises: Promise<void>[] = []; // Alterado para Promise<void> para melhor controle do Promise.all
        let results: any[] = [];

        try {
            // Obter dados, usando o filtro se tableId for diferente de 0
            if (tableId === 0) {
                results = await this.getTableData(tableName);
            } else {
                const orderBy = "fgk_segment ASC"
                results = await CrudService.list(tableName, {
                    where: ["d_id = ?"],
                    params: [tableId],
                    orderBy
                });
            }

            if (!results || results.length === 0) {
                console.log(`Nenhum dado de imagem encontrado na tabela ${tableName}.`);
                return [];
            }

            let segmentId = 0;
            let index = 1;

            for (const row of results) {
                // Lógica original para contagem de segmento/foto
                if (segmentId != row.fgk_segment) {
                    segmentId = row.fgk_segment;
                    index = 1;
                } else {
                    index++;
                }

                const base64Data = row.img;

                if (base64Data) {
                    // Monta um nome de arquivo útil
                    const fileId = `${row.ID_HOLE}_from${row.depth_from}_to${row.depth_to}_pic${index}`;

                    let cleanedBase64Data = base64Data;
                    // Remove prefixo de data URI (ex: data:image/jpeg;base64,)
                    if (base64Data.includes('base64,')) {
                        cleanedBase64Data = base64Data.split('base64,')[1];
                    }

                    const fileName = `${fileId}.jpg`;
                    const filePath = `${FileSystem.documentDirectory}${fileName}`;

                    // Cria a Promise de salvamento
                    const savePromise = FileSystem.writeAsStringAsync(
                        filePath,
                        cleanedBase64Data,
                        { encoding: FileSystem.EncodingType.Base64 }
                    )
                        .then(() => {
                            savedFilePaths.push(filePath);
                        })
                        .catch(error => {
                            // Não interrompe o loop, apenas registra o erro e continua
                            console.error(`Erro ao salvar a imagem ${fileName}:`, error);
                        });

                    savePromises.push(savePromise);
                }
            }

            await Promise.all(savePromises); // Aguarda todos os salvamentos

            console.log(`Processo finalizado. ${savedFilePaths.length} imagens salvas.`);
            return savedFilePaths;

        } catch (error) {
            console.error(`Erro geral ao processar a tabela ${tableName}:`, error);
            throw error;
        }
    }

}
