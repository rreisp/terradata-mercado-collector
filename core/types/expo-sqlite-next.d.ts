declare module 'expo-sqlite/next' {
    import * as SQLite from 'expo-sqlite';

    export * from 'expo-sqlite';

    export function getDatabaseFileLocation(name: string): string;

    export function openDatabaseSync(
        name: string,
        version?: string,
        description?: string,
        size?: number
    ): SQLite.WebSQLDatabase;
}
