import * as MailComposer from 'expo-mail-composer';

export type EmailPayload = {
    recipients?: string[];
    subject: string;
    body?: string;
    attachments?: string[];
};

export class EmailService {
    static async isAvailable(): Promise<boolean> {
        return MailComposer.isAvailableAsync();
    }

    static async send({
        recipients = [],
        subject,
        body = '',
        attachments = [],
    }: EmailPayload): Promise<void> {
        const available = await this.isAvailable();

        if (!available) {
            throw new Error('E-mail não disponível no dispositivo');
        }

        await MailComposer.composeAsync({
            recipients,
            subject,
            body,
            attachments,
        });
    }
}
