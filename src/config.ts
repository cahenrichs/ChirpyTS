import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type APIConfig = {
    fileserverHits: number,
    port: number,
    platform: string,
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DbConfig = {
  migrationConfig: MigrationConfig,
  dbURL: string
}

type JWTConfig = {
    defaultDuration: number,
    secret: string,
    issuer: string
}

type MasterConfig = {
    api: APIConfig,
    db: DbConfig,
    jwt: JWTConfig
}

export const config: MasterConfig = {
    api: {
        fileserverHits: 0,
        port: Number(envOrThrow("PORT")),
        platform: envOrThrow("PLATFORM"),
    },
    db: {
        migrationConfig,
        dbURL: envOrThrow("DB_URL")
    },
    jwt: {
        defaultDuration: 60 * 60, // 1 hour in seconds
        secret: envOrThrow("JWT_SECRET"),
        issuer: "chirpy",
    }
};

function envOrThrow(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment varible: ${key}`);
    }
    return value;
}