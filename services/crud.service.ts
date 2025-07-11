import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const db = SQLite.openDatabaseSync('app.db');

type Params = (string | number | null)[];

/**
 * Log detalhado de erro no console
 */
function logDetailedError(context: string, sql?: string, params?: Params, error?: any) {
    console.error(`[SQLite ERROR] ${context}`, {
        sql,
        params,
        name: error?.name ?? 'Erro desconhecido',
        message: error?.message ?? 'Sem mensagem de erro',
        stack: error?.stack ?? 'Sem stack trace',
    });
}

/**
 * Formata uma mensagem amigável para exibição (por exemplo, em Alert)
 */
function formatErrorMessage(context: string, error: any): string {
    return `${context}\n\nDetalhes: ${error?.message ?? 'Erro desconhecido'}`;
}

export class CrudService {
    static async executeSql<T = any>(sql: string, params: Params = []): Promise<T[]> {
        let results: T[] = [];
        try {
            await db.withTransactionAsync(async () => {
                results = await db.getAllAsync<T>(sql, params);
            });
        } catch (error) {
            logDetailedError('Erro ao executar SQL', sql, params, error);
            Alert.alert('Erro de banco de dados', formatErrorMessage('Falha ao executar consulta', error));
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
            logDetailedError('Erro ao executar query', sql, params, error);
            Alert.alert('Erro de banco de dados', formatErrorMessage('Falha ao executar query', error));
            throw error;
        }
    }

    static async createTable(tableName: string, columns: string): Promise<void> {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        try {
            await this.runQuery(sql);
        } catch (error) {
            logDetailedError(`Erro ao criar tabela ${tableName}`, sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao criar a tabela ${tableName}`, error));
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
            logDetailedError(`Erro ao inserir em ${tableName}`, sql, values, error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao inserir dados em ${tableName}`, error));
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
            logDetailedError(`Erro ao atualizar ${tableName}`, sql, [...values, ...whereParams], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao atualizar dados em ${tableName}`, error));
            throw error;
        }
    }

    static async delete(tableName: string, where: string, whereParams: Params): Promise<void> {
        const sql = `DELETE FROM ${tableName} WHERE ${where}`;
        try {
            await this.runQuery(sql, whereParams);
        } catch (error) {
            logDetailedError(`Erro ao deletar de ${tableName}`, sql, whereParams, error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao deletar dados de ${tableName}`, error));
            throw error;
        }
    }

    static async list<T>(tableName: string): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName}`;
        try {
            return await this.executeSql<T>(sql);
        } catch (error) {
            logDetailedError(`Erro ao listar dados de ${tableName}`, sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao listar dados de ${tableName}`, error));
            throw error;
        }
    }

    static async findById<T>(tableName: string, id: number): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        try {
            return await this.executeSql<T>(sql, [id]);
        } catch (error) {
            logDetailedError(`Erro ao buscar ID ${id} em ${tableName}`, sql, [id], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao buscar ID em ${tableName}`, error));
            throw error;
        }
    }

    static async truncate(tableName: string): Promise<void> {
        try {
            await this.runQuery(`DELETE FROM ${tableName}`);
            await this.runQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [tableName]);
        } catch (error) {
            logDetailedError(`Erro ao limpar tabela ${tableName}`, undefined, [tableName], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao limpar dados de ${tableName}`, error));
            throw error;
        }
    }

    static async drop(tableName: string): Promise<void> {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        try {
            await this.runQuery(sql);
        } catch (error) {
            logDetailedError(`Erro ao apagar tabela ${tableName}`, sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao apagar a tabela ${tableName}`, error));
            throw error;
        }
    }

    static async lastInsertId(): Promise<number> {
        const sql = 'SELECT last_insert_rowid() AS id';
        try {
            const result = await this.executeSql<{ id: number }>(sql);
            return result[0]?.id ?? 0;
        } catch (error) {
            logDetailedError('Erro ao obter last_insert_rowid', sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao obter ID do último registro inserido`, error));
            throw error;
        }
    }

    static async exportDatabase() {
        try {
            const dbPath = (SQLite as any).getDatabaseFileLocation('app.db');
            console.log('Caminho absoluto do banco de dados:', dbPath);
        } catch (error) {
            logDetailedError('Erro ao obter caminho do banco de dados', undefined, [], error);
            Alert.alert('Erro', formatErrorMessage('Erro ao obter caminho do banco de dados', error));
            throw error;
        }
    }
}
