import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

type Params = (string | number | null)[];

export class CrudService {
    static async executeSql<T = any>(sql: string, params: Params = []): Promise<T[]> {
        let results: T[] = [];

        await db.withTransactionAsync(async () => {
            results = await db.getAllAsync<T>(sql, params);
        });

        return results;
    }

    static async runQuery(sql: string, params: Params = []): Promise<void> {
        return await db.withTransactionAsync(async () => {
            await db.runAsync(sql, params);
        });
    }

    static async createTable(tableName: string, columns: string): Promise<void> {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        await this.runQuery(sql);
    }

    static async insert(tableName: string, data: Record<string, any>): Promise<void> {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(',');
        const values = keys.map(k => data[k]);

        const sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
        await this.runQuery(sql, values);
    }

    static async update(
        tableName: string,
        data: Record<string, any>,
        where: string,
        whereParams: Params
    ): Promise<void> {
        const keys = Object.keys(data);
        const setClause = keys.map(k => `${k} = ?`).join(', ');
        const values = keys.map(k => data[k]);

        const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${where}`;
        await this.runQuery(sql, [...values, ...whereParams]);
    }

    static async delete(tableName: string, where: string, whereParams: Params): Promise<void> {
        const sql = `DELETE FROM ${tableName} WHERE ${where}`;
        await this.runQuery(sql, whereParams);
    }

    static async list<T>(tableName: string): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName}`;
        return await this.executeSql<T>(sql);
    }

    static async findById<T>(tableName: string, id: number): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        return await this.executeSql<T>(sql, [id]);
    }

    static async clearTable(tableName: string): Promise<void> {
        await this.runQuery(`DELETE FROM ${tableName}`);
        await this.runQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [tableName]); // opcional: reseta o AUTOINCREMENT
    }

    static async exportarBanco() {
        const dbPath = (SQLite as any).getDatabaseFileLocation('app.db');
        console.log('Caminho absoluto do banco de dados:', dbPath);
    }
}
