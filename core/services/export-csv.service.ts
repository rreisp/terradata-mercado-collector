import * as FileSystem from 'expo-file-system';
import { CrudService } from '@/core/services/crud.service';
import * as Sharing from 'expo-sharing';
import { zip } from 'react-native-zip-archive';

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

export async function getTableData2(tableName: string, title: string) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    let fieldName = 'ID_HOLE=';
    if(tableName=='lithologiesExport'){
        fieldName = 'DRILLING_ID=';
    }
    const result = CrudService.list(tableName, [fieldName], [title]);
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

function getDateTimeString(): string {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    // const dateExport = `${day}-${month}-${year}`;
    const dateExport = `${year}-${month}-${day}`;

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const timeExport = `${hours}-${minutes}-${seconds}`;

    return `${dateExport}_${timeExport}`;
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
    if (id !== 0) {
        const idHole = await CrudService.getTitleHole(id);
        try{
            const data = await getTableData2(tableName, idHole);
            const csv = convertToCSV(data);
            const fileUri = await saveCSVFile(`${tableName}_${idHole}.csv`, csv);
            console.log("Arquivo salvo em:", fileUri);
            return fileUri;
        } catch (error) {
            console.error("Erro ao exportar tabela:", error);
            throw error;
        }

    } else {

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
}

export async function exportAllZIP(
    csvFiles: CsvFile[],
    imagePaths: string[] = [],
    exportType: string
): Promise<void | string> {
    
    // 1. Definir caminhos
    const stagingFolderName = `staging_${new Date().getTime()}`; 
    const stagingDir = `${FileSystem.cacheDirectory}${stagingFolderName}/`;
    
    const zipFileName = `export${exportType}_${getDateTimeString()}.zip`;
    const zipPath = `${FileSystem.documentDirectory}${zipFileName}`;

    try {
        console.log(`Iniciando exportação nativa via Staging em: ${stagingDir}`);

        // 2. Criar o diretório de Staging (Intermediário)
        // Se já existir algo lá, garante que cria limpo
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
        console.log("Comprimindo arquivos (Nativo)...");
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
            UTI: 'public.zip-archive'
        });

        return zipPath;

    } catch (error) {
        console.error('Erro ao criar o arquivo ZIP:', error);
        throw error;
    } finally {
        // --- 7. Limpeza ---
        try {
            await FileSystem.deleteAsync(stagingDir, { idempotent: true });
            console.log("Pasta temporária de staging limpa.");
        } catch (cleanupError) {
            console.warn("Falha ao limpar pasta temporária:", cleanupError);
        }
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
