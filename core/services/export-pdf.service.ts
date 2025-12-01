import { CrudService } from '@/core/services/crud.service';

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

export async function getData(tableName: string, id: number) {
    if (id !== 0) {
        const idHole = await CrudService.getTitleHole(id);
        try {
            const data = await getTableData2(tableName, idHole);
            return data;
        } catch (error) {
            console.error("Erro ao exportar tabela:", error);
            throw error;
        }

    } else {
        try {
            const data = await getAllTableData(tableName);
            return data;
        } catch (error) {
            console.error("Erro ao exportar tabela:", error);
            throw error;
        }
    }
}