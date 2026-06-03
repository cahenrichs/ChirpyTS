import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
    fileserverHits: number,
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DbConfig = {
  migrationConfig: MigrationConfig,
  dbURL: string
}

type MasterConfig = {
    api: APIConfig,
    db: DbConfig
}

export const config: MasterConfig = {
    api: {
        fileserverHits: 0,
    },
    db: {
        migrationConfig,
        dbURL: envOrThrow("DB_URL")
    }
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment varible: ${key}`);
    }
    return value;
}