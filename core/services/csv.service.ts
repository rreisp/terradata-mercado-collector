import * as FileSystem from 'expo-file-system';

export class CSVService {
    /**
     * @private
     * Converte um array de objetos em uma string formatada em CSV.
     * @param data Array de objetos (dados da tabela).
     * @returns String formatada em CSV.
     */

    static convertToCSV(data: any[], separator: string = ","): string {
    if (!data || data.length === 0) return "";

    // Garante que todas as chaves sejam usadas como cabeçalho
    const allKeys = new Set<string>();
    data.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
    const headers = Array.from(allKeys).join(separator);

    const rows = data.map((row) =>
        Array.from(allKeys)
            .map((key) => {
                let value = row[key];
                // Verifica se o valor é texto. Se for, limpa as quebras de linha.
                if (typeof value === 'string') {
                    value = value.replace(/[\r\n]+/g, ' ');
                }

                return `"${value ?? ""}"`; 
            })
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
    static async saveCSVFile(filename: string, content: string): Promise<string> {
        const fileUri = FileSystem.documentDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, content, {
            encoding: FileSystem.EncodingType.UTF8,
        });
        return fileUri;
    }
}