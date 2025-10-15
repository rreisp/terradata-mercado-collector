import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import JSZip from 'jszip';
import RNFS from 'react-native-fs';
import { CrudService } from '@/core/services/crud.service';

// Interface para definir a estrutura dos arquivos CSV
interface CsvFile {
    path: string;
    fileName: string;
}

// const db = SQLite.openDatabaseSync('app.db');

export async function getTableData(tableName: string, id: number) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    const result = CrudService.list(tableName, ["d_id="], [id]);
    return result; // já é um array de objetos
}

export async function getAllTableData(tableName: string) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    const result = CrudService.list(tableName,[]);
    return result; // já é um array de objetos
}

function convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row) =>
        Object.values(row)
            .map((val) => `"${val ?? ""}"`)
            .join(",")
    );

    return [headers, ...rows].join("\n");
}

export async function saveCSVFile(filename: string, content: string) {
    const fileUri = FileSystem.documentDirectory + filename;
    await FileSystem.writeAsStringAsync(fileUri, content, {
        encoding: FileSystem.EncodingType.UTF8,
    });
    return fileUri;
}


export async function exportTableToCSV(tableName: string, id: number) {
    // saveImagesFromTable('export_images', id).then((filePaths) => {
    //   console.log('Imagens salvas:', filePaths);
    // }).catch((error) => {
    //   console.error('Erro ao salvar imagens:', error);
    // });

    try {
        const data = await getAllTableData(tableName);
        const csv = convertToCSV(data);
        const fileUri = await saveCSVFile(`${tableName}.csv`, csv);
        console.log("Arquivo salvo em:", fileUri);
        return fileUri;
    } catch (error) {
        console.error("Erro ao exportar tabela:", error);
        throw error;
    }
}

export async function exportZIP(
    csvFilePath: string,
    csvFileName: string,
    imagePaths: string[] = [] // Novo parâmetro
): Promise<string> {
    const zip = new JSZip();

    try {
        // --- 1. Adicionar o Arquivo CSV ---
        const csvContent = await FileSystem.readAsStringAsync(csvFilePath);
        zip.file(csvFileName, csvContent);
        console.log(`CSV '${csvFileName}' adicionado.`);

        // --- 2. Adicionar os Arquivos de Imagem (Novidade) ---
        if (imagePaths.length > 0) {
            console.log(`Adicionando ${imagePaths.length} arquivos de imagem...`);

            // Itera sobre cada caminho de imagem
            for (const path of imagePaths) {
                // Obtém o nome do arquivo a partir do caminho completo
                // O substring(lastIndexOf('/')) garante que pegamos o nome do arquivo
                const fileName = path.substring(path.lastIndexOf('/') + 1);

                // Lê o conteúdo binário do arquivo em Base64
                // Usamos Base64 porque o JSZip lida melhor com dados binários através dele
                const imageContentBase64 = await FileSystem.readAsStringAsync(path, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                // Adiciona o arquivo ao ZIP, informando que o conteúdo está em Base64
                zip.file(fileName, imageContentBase64, { base64: true });
                console.log(`Imagem '${fileName}' adicionada.`);
            }
        }


        // --- 3. Gerar e Salvar o Arquivo ZIP ---
        const zipFile = await zip.generateAsync({ type: 'base64' });

        const zipPath = FileSystem.documentDirectory + 'arquivos_compactados.zip';
        await FileSystem.writeAsStringAsync(zipPath, zipFile, { encoding: FileSystem.EncodingType.Base64 });

        console.log(`Arquivo ZIP criado em: ${zipPath}`);
        return zipPath;

    } catch (error) {
        console.error('Erro ao criar o arquivo ZIP:', error);
        throw error;
    }
}

export async function exportAllZIP(
    csvFiles: CsvFile[],
    imagePaths: string[] = []
): Promise<string> {
    const zip = new JSZip();

    try {
        console.log(`Adicionando ${csvFiles.length} arquivos CSV...`);
        for (const csvFile of csvFiles) {
            const csvContent = await FileSystem.readAsStringAsync(csvFile.path);
            zip.file(csvFile.fileName, csvContent);
            console.log(`CSV '${csvFile.fileName}' adicionado.`);
        }
        if (imagePaths.length > 0) {
            console.log(`Adicionando ${imagePaths.length} arquivos de imagem...`);
            for (const path of imagePaths) {
                const fileName = path.substring(path.lastIndexOf('/') + 1);
                const imageContentBase64 = await FileSystem.readAsStringAsync(path, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                zip.file(fileName, imageContentBase64, { base64: true });
                console.log(`Imagem '${fileName}' adicionada.`);
            }
        }

        // --- 3. Gerar e Salvar o Arquivo ZIP ---
        const zipFile = await zip.generateAsync({ type: 'base64' });
        const zipPath = FileSystem.documentDirectory + 'exportacao_completa.zip';
        await FileSystem.writeAsStringAsync(zipPath, zipFile, { encoding: FileSystem.EncodingType.Base64 });

        console.log(`Arquivo ZIP criado em: ${zipPath}`);
        return zipPath;

    } catch (error) {
        console.error('Erro ao criar o arquivo ZIP:', error);
        throw error;
    }
}


export async function saveImagesFromTable(tableName: string, tableId: number): Promise<string[]> {

    const savePromises: Promise<string>[] = [];
    const savedFilePaths: string[] = [];
    let results: any[] = [];
    try {
        if(tableId === 0){
            results = await getAllTableData(tableName);
        }else{
            results = await getTableData(tableName, tableId);
        }

        if (!results || results.length === 0) {
            console.log(`Nenhum dado encontrado na tabela ${tableName} com d_id = ${tableId}.`);
            return [];
        }

        for (const row of results) {
            const base64Data = row.img;
            const fileId = row.ID_HOLE+'_'+row.fgk_segment+'_'+row.id;

            if (base64Data && fileId) {

                let cleanedBase64Data = base64Data;
                if (base64Data.includes('base64,')) {
                    cleanedBase64Data = base64Data.split('base64,')[1];
                }
                const fileName = `${fileId}.jpg`;

                const filePath = `${FileSystem.documentDirectory}${fileName}`;

                const savePromise = FileSystem.writeAsStringAsync(
                    filePath,
                    cleanedBase64Data,
                    { encoding: FileSystem.EncodingType.Base64 }
                )
                    .then(() => {
                        savedFilePaths.push(filePath);
                        return filePath;
                    })
                    .catch(error => {
                        console.error(`Erro ao salvar a imagem do ID ${fileId}:`, error);
                        return null;
                    });

                savePromises.push(savePromise as Promise<string>);
            }
        }

        await Promise.all(savePromises);

        console.log(`Processo finalizado. ${savedFilePaths.length} imagens salvas.`);
        return savedFilePaths;

    } catch (error) {
        console.error(`Erro geral ao processar a tabela ${tableName}:`, error);
        throw error;
    }
}
