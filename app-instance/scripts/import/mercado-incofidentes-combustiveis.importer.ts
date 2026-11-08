import { DataImporter } from "@/core/types/data-importer";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { CrudService } from "@/core/services/crud.service";

export class MercadoInconfidentesCombustiveisImporter implements DataImporter {
    private language: string;
    private isPT: boolean;

    constructor(language: string) {
        this.language = language;
        this.isPT = language === 'pt-BR';
    }

    public async importDatabase() : Promise<void>{
       try {
        const result = await DocumentPicker.getDocumentAsync({ 
            type: '*/*', 
            copyToCacheDirectory: true, 
        });

        if (result.canceled) {
            console.log("Importação cancelada pelo usuário.");
            return;
        }

        const file = result.assets[0];
        console.log(`Arquivo selecionado: ${file.name}`);

        // Validação básica para garantir que o usuário não pegou uma imagem ou PDF
        if (!file.name.endsWith('.db') && !file.name.endsWith('.sqlite')) {
            alert("Por favor, selecione um arquivo de banco de dados válido (.db ou .sqlite)");
            return;
        }

        const sqliteDirectory = FileSystem.documentDirectory + 'SQLite';
        const destPath = `${sqliteDirectory}/app.db`;

        const dirInfo = await FileSystem.getInfoAsync(sqliteDirectory);
        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(sqliteDirectory, { intermediates: true });
        }

        console.log(`Copiando ${file.uri} para ${destPath}...`);
        
        await CrudService.closeConnection(); // Certifique-se de que o banco de dados está fechado antes de substituir o arquivo
        await FileSystem.copyAsync({
            from: file.uri,
            to: destPath,
        });
        await CrudService.reopenConnection(); // Reabra a conexão para que o SQLite reconheça o novo arquivo


        console.log("Banco de dados substituído com sucesso!");
        

        alert("Banco de dados importado com sucesso! Reinicie a aplicação para usar os novos dados.");
        

    } catch (error) {
        console.error("Erro ao importar o arquivo .db:", error);
        alert("Ocorreu um erro ao tentar substituir o banco de dados.");
        throw error;
    }
    }
}
