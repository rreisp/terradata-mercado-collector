import * as FileSystem from 'expo-file-system';

export async function exportarBancoComSAF() {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/app.db`;

    // Verifica se o banco existe
    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (!fileInfo.exists) {
      alert('Banco de dados não encontrado.');
      return;
    }

    // Pede permissão para o usuário escolher a pasta
    const permission = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permission.granted) {
      alert('Permissão para acessar a pasta foi negada.');
      return;
    }

    const folderUri = permission.directoryUri;

    // Cria o novo arquivo dentro da pasta escolhida
    const newFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
      folderUri,
      'app.db',
      'application/octet-stream'
    );

    // Lê o conteúdo do banco como binário
    const fileData = await FileSystem.readAsStringAsync(dbPath, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Escreve no novo arquivo
    await FileSystem.writeAsStringAsync(newFileUri, fileData, {
      encoding: FileSystem.EncodingType.Base64,
    });

    alert('Banco exportado com sucesso!');
    console.log('Exportado para:', newFileUri);
  } catch (error) {
    console.error('Erro ao exportar banco:', error);
    alert('Erro ao exportar banco.');
  }
}
