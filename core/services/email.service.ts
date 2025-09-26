import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

export async function enviarBancoPorEmail() {
    try {
        const dbPath = `${FileSystem.documentDirectory}SQLite/app.db`;

        // Verifica se o MailComposer está disponível
        const isAvailable = await MailComposer.isAvailableAsync();
        if (!isAvailable) {
            alert('O recurso de envio de e-mail não está disponível neste dispositivo.');
            return;
        }

        // Envia o e-mail com o banco em anexo
        await MailComposer.composeAsync({
            recipients: ['rreisp@gmail.com'], // altere conforme necessário
            subject: 'Backup do banco de dados',
            body: 'Segue em anexo o arquivo do banco de dados app.db.',
            attachments: [dbPath],
        });

        console.log('E-mail enviado com sucesso');
    } catch (error) {
        console.error('Erro ao tentar enviar o e-mail:', error);
    }
}