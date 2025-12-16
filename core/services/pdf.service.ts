import { CrudService } from '@/core/services/crud.service';

/**
 * Serviço responsável pela busca de dados em diferentes tabelas,
 * aplicando filtros baseados no ID da furação (d_id) ou buscando todos os dados.
 */
export class PDFService {

    /**
     * @private
     * Busca dados de uma tabela filtrando pelo título/nome do Furo.
     * Mapeia a função original `getTableData2`.
     * @param tableName Nome da tabela.
     * @param title Título/Nome do Furo a ser filtrado.
     * @returns Array de objetos com os dados filtrados.
     */
    private static async getTableDataByHoleTitle(tableName: string, title: string): Promise<any[]> {
        let fieldName = 'ID_HOLE=';
        // Lógica para determinar o campo de filtro com base no nome da tabela
        if (tableName === 'lithologiesExport') {
            fieldName = 'DRILLING_ID=';
        }
        
        // Chamada ao CrudService
        const result = CrudService.list(tableName, [fieldName], [title]);
        return result;
    }

    /**
     * @private
     * Busca todos os dados de uma tabela.
     * Mapeia a função original `getAllTableData`.
     * @param tableName Nome da tabela.
     * @returns Array de objetos com todos os dados da tabela.
     */
    private static async getAllTableData(tableName: string): Promise<any[]> {
        // Chamada ao CrudService sem filtros
        const result = CrudService.list(tableName, []);
        return result;
    }

    /**
     * Função principal para buscar dados da tabela.
     * Se um 'id' for fornecido (d_id), busca os dados filtrados pelo nome do furo.
     * Caso contrário, busca todos os dados da tabela.
     * Mapeia a função original `getData`.
     * * @param tableName Nome da tabela a ser consultada.
     * @param id ID do registro principal (d_id). Se 0, busca todos os dados.
     * @returns Promise que resolve com um array de objetos (dados da tabela).
     */
    public static async getData(tableName: string, id: number): Promise<any[]> {
        
        if (id !== 0) {
            // Lógica para buscar dados de um furo específico (ID !== 0)
            try {
                // 1. Obter o título/nome do furo usando o ID principal
                const idHole = await CrudService.getTitleHole(id);
                
                // 2. Buscar dados da tabela filtrando pelo nome do furo
                const data = await this.getTableDataByHoleTitle(tableName, idHole);
                return data;

            } catch (error) {
                console.error(`Erro ao buscar dados para o ID ${id} na tabela ${tableName}:`, error);
                // Re-lança o erro para ser tratado pela camada superior
                throw error;
            }

        } else {
            // Lógica para buscar todos os dados (ID === 0)
            try {
                const data = await this.getAllTableData(tableName);
                return data;
            } catch (error) {
                console.error(`Erro ao buscar todos os dados da tabela ${tableName}:`, error);
                throw error;
            }
        }
    }
}