import * as FileSystem from 'expo-file-system';
import { CrudService } from '@/core/services/crud.service';
import * as Sharing from 'expo-sharing';
// import { zip } from 'react-native-zip-archive';
import { CsvFile } from '../types/data/csv-file';

// const db = SQLite.openDatabaseSync('app.db');

export async function getTableData(tableName: string, id: number, orderBy: string) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    const result = CrudService.list(tableName, ["d_id="], [id], orderBy);
    return result; // já é um array de objetos
}

export async function getTableData2(tableName: string, title: string) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    let fieldName = 'ID_HOLE=';
    if (tableName == 'lithologiesExport') {
        fieldName = 'DRILLING_ID=';
    }
    const result = CrudService.list(tableName, [fieldName], [title]);
    return result; // já é um array de objetos
}

export async function getAllTableData(tableName: string) {
    //   const result = await db.getAllAsync(`SELECT * FROM ${tableName} WHERE d_id = ${id}`);
    const result = CrudService.list(tableName, []);
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


export async function exportTableToCSV(tableName: string, id: number = 0) {
    // saveImagesFromTable('export_images', id).then((filePaths) => {
    //   console.log('Imagens salvas:', filePaths);
    // }).catch((error) => {
    //   console.error('Erro ao salvar imagens:', error);
    // });
    if (id !== 0) {
        const idHole = await CrudService.getTitleHole(id);
        try {
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

export async function saveImagesFromTable(tableName: string, tableId: number): Promise<string[]> {

    const savePromises: Promise<string>[] = [];
    const savedFilePaths: string[] = [];
    let results: any[] = [];
    try {
        if (tableId === 0) {
            results = await getAllTableData(tableName);
        } else {
            const orderBy = "fgk_segment ASC"
            results = await getTableData(tableName, tableId, orderBy);
        }

        if (!results || results.length === 0) {
            console.log(`Nenhum dado encontrado na tabela ${tableName} com d_id = ${tableId}.`);
            return [];
        }

        let segmentId = 0;
        let index = 1;
        for (const row of results) {
            if(segmentId != row.fgk_segment){
                segmentId = row.fgk_segment
                index = 1
            } else {
                index++;
            }
            const base64Data = row.img;
            // const fileId = row.ID_HOLE+'_'+row.fgk_segment+'_'+row.id;
            // const fileId = `${row.ID_HOLE}_from${row.depth_from}_to${row.depth_to}_pic${row.id}`;
            const fileId = `${row.ID_HOLE}_from${row.depth_from}_to${row.depth_to}_pic${index}`;

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
