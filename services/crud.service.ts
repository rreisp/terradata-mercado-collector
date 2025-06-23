import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('app.db');

type Params = (string | number | null)[];

export class CrudService {
    static async executeSql<T = any>(sql: string, params: Params = []): Promise<T[]> {
        let results: T[] = [];
        try {
            await db.withTransactionAsync(async () => {
                results = await db.getAllAsync<T>(sql, params);
            });
        } catch (error) {
            console.error(`Erro ao executar SQL: ${sql} - Params: ${JSON.stringify(params)}`, error);
            throw error;
        }
        return results;
    }

    static async runQuery(sql: string, params: Params = []): Promise<void> {
        try {
            await db.withTransactionAsync(async () => {
                await db.runAsync(sql, params);
            });
        } catch (error) {
            console.error(`Erro ao executar query: ${sql} - Params: ${JSON.stringify(params)}`, error);
            throw error;
        }
    }

    static async createTable(tableName: string, columns: string): Promise<void> {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        try {
            await this.runQuery(sql);
        } catch (error) {
            console.error(`Erro ao criar tabela ${tableName}:`, error);
            throw error;
        }
    }

    static async insert(tableName: string, data: Record<string, any>): Promise<void> {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?').join(',');
        const values = keys.map(k => data[k]);

        const sql = `INSERT INTO ${tableName} (${keys.join(',')}) VALUES (${placeholders})`;
        try {
            await this.runQuery(sql, values);
        } catch (error) {
            console.error(`Erro ao inserir em ${tableName} - Dados: ${JSON.stringify(data)}`, error);
            throw error;
        }
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
        try {
            await this.runQuery(sql, [...values, ...whereParams]);
        } catch (error) {
            console.error(`Erro ao atualizar ${tableName} - Dados: ${JSON.stringify(data)} - Where: ${where}`, error);
            throw error;
        }
    }

    static async delete(tableName: string, where: string, whereParams: Params): Promise<void> {
        const sql = `DELETE FROM ${tableName} WHERE ${where}`;
        try {
            await this.runQuery(sql, whereParams);
        } catch (error) {
            console.error(`Erro ao deletar de ${tableName} - Where: ${where} - Params: ${JSON.stringify(whereParams)}`, error);
            throw error;
        }
    }

    static async list<T>(tableName: string): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName}`;
        try {
            return await this.executeSql<T>(sql);
        } catch (error) {
            console.error(`Erro ao listar dados de ${tableName}:`, error);
            throw error;
        }
    }

    static async findById<T>(tableName: string, id: number): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        try {
            return await this.executeSql<T>(sql, [id]);
        } catch (error) {
            console.error(`Erro ao buscar ID ${id} na tabela ${tableName}:`, error);
            throw error;
        }
    }

    static async truncate(tableName: string): Promise<void> {
        try {
            await this.runQuery(`DELETE FROM ${tableName}`);
            await this.runQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [tableName]);
        } catch (error) {
            console.error(`Erro ao limpar a tabela ${tableName}:`, error);
            throw error;
        }
    }

    static async drop(tableName: string): Promise<void> {
        try {
            console.log(`Apagando tabela ${tableName}...`);
            await this.runQuery(`DROP TABLE IF EXISTS ${tableName}`);
            console.log(`Tabela ${tableName} apagada com sucesso.`);
        } catch (error) {
            console.error(`Erro ao apagar a tabela ${tableName}:`, error);
            throw error;
        }
    }    

    static async lastInsertId(): Promise<number> {
        const sql = 'SELECT last_insert_rowid() AS id';
        try {
            const result = await this.executeSql<{ id: number }>(sql);
            return result[0]?.id ?? 0;
        } catch (error) {
            console.error(`Erro ao obter last_insert_rowid:`, error);
            throw error;
        }
    }

    static async exportDatabase() {
        try {
            const dbPath = (SQLite as any).getDatabaseFileLocation('app.db');
            console.log('Caminho absoluto do banco de dados:', dbPath);
        } catch (error) {
            console.error(`Erro ao obter localização do banco de dados:`, error);
            throw error;
        }
    }
}
