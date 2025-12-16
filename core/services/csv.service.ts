import * as FileSystem from 'expo-file-system';
import { CrudService } from '@/core/services/crud.service';

/**
 * Serviço responsável pela exportação de dados (tabelas e imagens)
 * para CSV, manipulação de arquivos e compactação ZIP.
 */
export class CSVService {

    /**
     * @private
     * Converte um array de objetos em uma string formatada em CSV.
     * @param data Array de objetos (dados da tabela).
     * @returns String formatada em CSV.
     */
    private static convertToCSV(data: any[], separator: string = ","): string {
        if (!data || data.length === 0) return "";

        // Garante que todas as chaves sejam usadas como cabeçalho
        const allKeys = new Set<string>();
        data.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
        const headers = Array.from(allKeys).join(separator);

        const rows = data.map((row) =>
            Array.from(allKeys)
                .map((key) => `"${row[key] ?? ""}"`) // Garante que a ordem dos valores siga a ordem dos headers
                .join(separator)
        );

        return [headers, ...rows].join("\n");
    }

    /**
     * @private
     * Salva o conteúdo em um arquivo no diretório de documentos do FileSystem.
     * @param filename Nome do arquivo (ex: tabela.csv).
     * @param content Conteúdo a ser escrito.
     * @returns URI do arquivo salvo.
     */
    private static async saveCSVFile(filename: string, content: string): Promise<string> {
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, content, {
            encoding: FileSystem.EncodingType.UTF8,
        });
        return fileUri;
    }

    /**
     * @private
     * Retorna dados de uma tabela com filtro por d_id ou sem filtro.
     * Mapeia as funções originais `getTableData`, `getTableData2` e `getAllTableData`.
     * @param tableName Nome da tabela.
     * @param id ID do furo (d_id) opcional para filtrar dados.
     * @returns Array de objetos com os dados da tabela.
     */
    private static async getTableData(tableName: string, id?: number): Promise<any[]> {
        if (id) {
            // Lógica original de getTableData
            // const result = CrudService.list(tableName, ["d_id="], [id], orderBy);
            // Assumindo que CrudService.list lida com a busca
            const result = CrudService.list(tableName, ["d_id="], [id]);
            return result;
        } else {
            // Lógica original de getAllTableData
            const result = CrudService.list(tableName, []);
            return result;
        }
    }

    /**
     * @private
     * Retorna dados de uma tabela filtrados por ID do Furo (ID_HOLE) ou DRILLING_ID.
     * Mapeia a função original `getTableData2`.
     * @param tableName Nome da tabela.
     * @param title Título/Nome do Furo a ser filtrado.
     * @returns Array de objetos com os dados filtrados.
     */
    private static async getTableDataByHoleTitle(tableName: string, title: string): Promise<any[]> {
        let fieldName = 'ID_HOLE=';
        if (tableName === 'lithologiesExport') {
            fieldName = 'DRILLING_ID=';
        }
        const result = CrudService.list(tableName, [fieldName], [title]);
        return result;
    }

    /**
     * Exporta os dados de uma tabela para um arquivo CSV.
     * O nome do arquivo incluirá o ID do furo se fornecido.
     * @param tableName Nome da tabela a ser exportada.
     * @param d_id ID (d_id) da tabela principal opcional (se 0, exporta tudo).
     * @returns Promise que resolve com a URI do arquivo CSV.
     */
    public static async exportTableToCSV(tableName: string, d_id: number = 0): Promise<string> {
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
            const csv = this.convertToCSV(data);
            // 4. Salvar o arquivo
            const fileUri = await this.saveCSVFile(filename, csv);

            console.log(`Arquivo CSV salvo: ${fileUri}`);
            return fileUri;

        } catch (error) {
            console.error(`Erro ao exportar tabela '${tableName}':`, error);
            throw error;
        }
    }


    /**
     * Busca dados de imagem (base64) de uma tabela e salva as imagens como arquivos JPG.
     * Mapeia a função original `saveImagesFromTable`.
     * @param tableName Nome da tabela que contém os dados da imagem (coluna 'img').
     * @param tableId ID da tabela principal opcional para filtro.
     * @returns Promise que resolve com um array de caminhos dos arquivos JPG salvos.
     */
    public static async saveImagesFromTable(tableName: string, tableId: number): Promise<string[]> {
        const savedFilePaths: string[] = [];
        const savePromises: Promise<void>[] = []; // Alterado para Promise<void> para melhor controle do Promise.all
        let results: any[] = [];

        try {
            // Obter dados, usando o filtro se tableId for diferente de 0
            if (tableId === 0) {
                results = await this.getTableData(tableName);
            } else {
                const orderBy = "fgk_segment ASC"
                results = await CrudService.list(tableName, ["d_id="], [tableId], orderBy);
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