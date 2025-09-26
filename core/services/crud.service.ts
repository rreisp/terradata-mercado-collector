import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';

const db = SQLite.openDatabaseSync('app.db');

type Params = (string | number | null | undefined)[];

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
                // console.log(results);
            });
        } catch (error) {
            logDetailedError('Erro ao executar SQL', sql, params, error);
            Alert.alert('Erro de banco de dados', formatErrorMessage("Falha ao executar consulta '" + sql + "'", error));
            throw error;
        }
        return results;
    }

    static async runQuery(sql: string, params: Params = []): Promise<void> {
        try {
            // await db.withTransactionAsync(async () => {
            await db.runAsync(sql, params);
            // });
        } catch (error) {
            logDetailedError('Erro ao executar query', sql, params, error);
            Alert.alert('Erro de banco de dados', formatErrorMessage('Falha ao executar query', error));
            throw error;
        }
    }

    static async createTable(tableName: string, columns: string): Promise<void> {
        const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
        try {
            await db.runAsync(sql); // sem transação
            // await this.runQuery(sql);
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
            // await this.runQuery(sql, values);
            await this.executeSql(sql, values);
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

    static async list<T>(
        tableName: string,
        where: string[] = [],
        whereParams: any[] = [],
        orderBy?: string,
        limit?: number,
        offset?: number
    ): Promise<T[]> {
        let sql = `SELECT * FROM ${tableName}`;

        if (where.length > 0) {
            sql += " WHERE ";
            const conditions = where.map((condition) => {
                const trimmed = condition.trim();
                if (/[=<>]|LIKE|IN/i.test(trimmed)) {
                    return trimmed.endsWith("?") ? trimmed : `${trimmed} ?`;
                }
                return `${trimmed} = ?`;
            });
            sql += conditions.join(" AND ");
        }

        if (orderBy) {
            sql += ` ORDER BY ${orderBy}`;
        }

        if (limit) {
            sql += ` LIMIT ?`;
            whereParams.push(limit);
        }

        if (offset) {
            sql += ` OFFSET ?`;
            whereParams.push(offset);
        }

        try {
            return await this.executeSql<T>(sql, whereParams);
        } catch (error) {
            console.warn("SQL:", sql, "PARAMS:", whereParams);
            throw error;
        }
    }

    static async findById<T>(tableName: string, id: number): Promise<T[]> {
        const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
        try {
            return await this.executeSql<T>(sql, [id]);
        } catch (error) {
            //logDetailedError(`Erro ao buscar ID ${id} em ${tableName}`, sql, [id], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao buscar ID em ${tableName}`, error));
            throw error;
        }
    }

    static async truncate(tableName: string): Promise<void> {
        try {
            await this.runQuery(`DELETE FROM ${tableName}`);
            await this.runQuery(`DELETE FROM sqlite_sequence WHERE name = ?`, [tableName]);
        } catch (error) {
            //logDetailedError(`Erro ao limpar tabela ${tableName}`, undefined, [tableName], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao limpar dados de ${tableName}`, error));
            throw error;
        }
    }

    static async drop(tableName: string): Promise<void> {
        const sql = `DROP TABLE IF EXISTS ${tableName}`;
        try {
            await this.runQuery(sql);
        } catch (error) {
            //logDetailedError(`Erro ao apagar tabela ${tableName}`, sql, [], error);
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
            //logDetailedError('Erro ao obter last_insert_rowid', sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao obter ID do último registro inserido`, error));
            throw error;
        }
    }

    static async exportDatabase() {
        try {
            const dbPath = (SQLite as any).getDatabaseFileLocation('app.db');
            console.log('Caminho absoluto do banco de dados:', dbPath);
        } catch (error) {
            //logDetailedError('Erro ao obter caminho do banco de dados', undefined, [], error);
            Alert.alert('Erro', formatErrorMessage('Erro ao obter caminho do banco de dados', error));
            throw error;
        }
    }

    static async exportToCsv(table: string, ids: number[]): Promise<string> {
        if (!ids.length) {
            throw new Error("A lista de IDs não pode estar vazia.");
        }

        // Monta placeholders para a query
        const placeholders = ids.map(() => '?').join(',');

        const sql = `SELECT * FROM ${table} WHERE id IN (${placeholders})`;
        try {
            const rows = await this.executeSql<Record<string, any>>(sql, ids);
            if (!rows.length) {
                throw new Error("Nenhum registro encontrado para os IDs fornecidos.");
            }

            // Cabeçalho do CSV
            const header = Object.keys(rows[0]).join(';');

            // Função para formatar cada valor
            const formatValue = (value: any) => {
                if (typeof value === 'number') {
                    // Substitui ponto por vírgula para decimais
                    return value.toString().replace('.', ',');
                }
                if (value === null || value === undefined) {
                    return '';
                }
                // Escapa aspas e separadores
                return `"${String(value).replace(/"/g, '""')}"`;
            };

            // Linhas do CSV
            const lines = rows.map(row =>
                Object.values(row).map(formatValue).join(';')
            );

            // Retorna CSV como string
            return [header, ...lines].join('\n');

        } catch (error) {
            logDetailedError(`Erro ao exportar para CSV da tabela ${table}`, sql, ids, error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao exportar dados de ${table} para CSV`, error));
            throw error;
        }
    }

    static async exportToCsv2(table: string, id: number): Promise<string> {
        const sql = `SELECT * FROM ${table} WHERE d_id = ?`;

        try {
            const rows = await this.executeSql<Record<string, any>>(sql, [id]);

            if (!rows.length) {
                throw new Error(`Nenhum registro encontrado para o ID fornecido: ${id}.`);
            }

            // Cabeçalho do CSV
            const header = Object.keys(rows[0]).join(';');

            // Função para formatar cada valor
            const formatValue = (value: any) => {
                if (typeof value === 'number') {
                    // Substitui ponto por vírgula para decimais
                    return value.toString().replace('.', ',');
                }
                if (value === null || value === undefined) {
                    return '';
                }
                // Escapa aspas e separadores
                return `"${String(value).replace(/"/g, '""')}"`;
            };

            // Linhas do CSV
            const lines = rows.map(row =>
                Object.values(row).map(formatValue).join(';')
            );

            // Retorna CSV como string
            return [header, ...lines].join('\n');

        } catch (error) {
            logDetailedError(`Erro ao exportar para CSV da tabela ${table}`, sql, [id], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao exportar dados de ${table} para CSV`, error));
            throw error;
        }
    }

    static async insertMultiple(
        tableName: string,
        dataArray: Record<string, any>[],
        uniqueConstraintKey: string // Adicione este parâmetro para a coluna a ser verificada
    ): Promise<void> {
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
            return;
        }

        const keys = Object.keys(dataArray[0]);

        const placeholders = `(${keys.map(() => '?').join(',')})`;
        const allPlaceholders = dataArray.map(() => placeholders).join(',');

        const values = dataArray.flatMap(item => keys.map(k => item[k]));

        const sql = `
        INSERT INTO ${tableName} (${keys.join(',')}) 
        VALUES ${allPlaceholders}
        ON CONFLICT(${uniqueConstraintKey}) DO NOTHING;
    `;

        try {
            await this.executeSql(sql, values);
        } catch (error) {
            logDetailedError(`Erro ao inserir múltiplos registros em ${tableName}`, sql, values, error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao inserir múltiplos dados em ${tableName}`, error));
            throw error;
        }
    }

    static async createView(name: string, code: string): Promise<void> {
        const sqlDrop = `DROP VIEW IF EXISTS ${name}`;
        // const sql = `CREATE VIEW IF NOT EXISTS ${name} AS ${code}`;
        const sql = `CREATE VIEW ${name} AS ${code}`;
        try {
            await db.runAsync(sqlDrop);
            await db.runAsync(sql);
        } catch (error) {
            logDetailedError(`Erro ao criar view ${name}`, sql, [], error);
            Alert.alert('Erro', formatErrorMessage(`Erro ao criar a view ${name}`, error));
            throw error;
        }
    }

    static async tableExists(tableName: string): Promise<boolean> {
        try {
            const result = await db.getAllAsync(
                "SELECT name FROM sqlite_master WHERE type='table' AND name=?",
                [tableName]
            );
            return result.length > 0;
        } catch (error) {
            console.error("Erro ao verificar tabela:", error);
            return false;
        }
    }
}
