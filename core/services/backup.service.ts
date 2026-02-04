import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

export class BackupService {
    static getDatabasePath(): string {
        return `${FileSystem.documentDirectory}SQLite/app.db`;
    }

    static getBackupPath(): string {
        return `${FileSystem.documentDirectory}backup_app.db`;
    }

    static async exportDatabase(): Promise<string> {
        if (Platform.OS === 'web') {
            throw new Error('Exportação não suportada na web');
        }

        const dbPath = this.getDatabasePath();
        const backupPath = this.getBackupPath();

        await FileSystem.copyAsync({
            from: dbPath,
            to: backupPath,
        });

        return backupPath;
    }
}
