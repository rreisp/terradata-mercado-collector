import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { zip } from 'react-native-zip-archive';
import { CsvFile } from '../types/data/csv-file';

export class ZIPService {
    /**
     * Compacta uma lista de arquivos CSV e caminhos de imagens em um arquivo ZIP e o compartilha.
     * Mapeia a função original `exportAllZIP`.
     * @param csvFiles Array de objetos CsvFile com o caminho (path) e nome (fileName) do CSV.
     * @param imagePaths Array de caminhos (URIs) dos arquivos de imagem.
     * @param exportType Tipo de exportação para nomear o arquivo ZIP.
     * @returns Promise que resolve com a URI do arquivo ZIP ou void se o compartilhamento falhar/não estiver disponível.
     */
    public static async exportAllZIP(
        csvFiles: CsvFile[],
        imagePaths: string[] = [],
        exportType: string = "All"
    ): Promise<void | string> {

        // 1. Definir caminhos e nomes
        const stagingFolderName = `staging_${new Date().getTime()}`;
        // Usa o cache directory para arquivos temporários
        const stagingDir = `${FileSystem.cacheDirectory}${stagingFolderName}/`;

        const zipFileName = `export_${exportType}_${this.getDateTimeString()}.zip`;
        // Salva o ZIP no document directory
        const zipPath = `${FileSystem.documentDirectory}${zipFileName}`;

        try {
            console.log(`Iniciando exportação via Staging em: ${stagingDir}`);

            // 2. Criar o diretório de Staging
            await FileSystem.makeDirectoryAsync(stagingDir, { intermediates: true });

            // --- 3. Copiar CSVs para a pasta de Staging ---
            console.log(`Copiando ${csvFiles.length} arquivos CSV...`);
            for (const csvFile of csvFiles) {
                await FileSystem.copyAsync({
                    from: csvFile.path,
                    to: stagingDir + csvFile.fileName
                });
                console.log(`CSV '${csvFile.fileName}' copiado.`);
            }

            // --- 4. Copiar Imagens para a pasta de Staging ---
            if (imagePaths.length > 0) {
                console.log(`Copiando ${imagePaths.length} arquivos de imagem...`);
                for (const path of imagePaths) {
                    // Pega apenas o nome do arquivo (ex: foto.jpg)
                    const fileName = path.substring(path.lastIndexOf('/') + 1);

                    await FileSystem.copyAsync({
                        from: path,
                        to: stagingDir + fileName
                    });
                    console.log(`Imagem '${fileName}' copiada.`);
                }
            }

            // --- 5. Executar o ZIP Nativo ---
            console.log("Comprimindo arquivos...");
            await zip(stagingDir, zipPath);
            console.log(`Arquivo ZIP criado em: ${zipPath}`);

            // --- 6. Compartilhar ---
            if (!(await Sharing.isAvailableAsync())) {
                alert("O compartilhamento de arquivos não está disponível no seu dispositivo.");
                return;
            }

            await Sharing.shareAsync(zipPath, {
                mimeType: 'application/zip',
                dialogTitle: 'Exportar dados compactados',
                UTI: 'public.zip-archive' // UTI comum para ZIPs
            });

            return zipPath;

        } catch (error) {
            console.error('Erro ao criar ou compartilhar o arquivo ZIP:', error);
            throw error;
        } finally {
            // --- 7. Limpeza ---
            try {
                // Deleta a pasta temporária de staging, mesmo se houver erro
                await FileSystem.deleteAsync(stagingDir, { idempotent: true });
                console.log("Pasta temporária de staging limpa.");
            } catch (cleanupError) {
                console.warn("Falha ao limpar pasta temporária:", cleanupError);
            }
        }
    }

    /**
     * @private
     * Gera uma string de data e hora formatada (YYYY-MM-DD_HH-MM-SS).
     * @returns String de data e hora.
     */
    private static getDateTimeString(): string {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const dateExport = `${year}-${month}-${day}`;

        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeExport = `${hours}-${minutes}-${seconds}`;

        return `${dateExport}_${timeExport}`;
    }
}