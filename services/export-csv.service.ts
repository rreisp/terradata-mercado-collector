import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as JSZip from 'jszip';

const db = SQLite.openDatabaseSync('app.db');

export async function getTableData(tableName: string) {
  const result = await db.getAllAsync(`SELECT * FROM ${tableName}`);
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

export async function exportTableToCSV(tableName: string) {
  try {
    const data = await getTableData(tableName);
    const csv = convertToCSV(data);
    const fileUri = await saveCSVFile(`${tableName}.csv`, csv);

    console.log("Arquivo salvo em:", fileUri);
    return fileUri;
  } catch (error) {
    console.error("Erro ao exportar tabela:", error);
    throw error;
  }
}