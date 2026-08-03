import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrations = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: false,
    migrationsTable: "pgmigrations",
  };
  if (request.method === "GET") {
    const migratedMigrations = await migrationRunner(defaultMigrations);
    await dbClient.end();
    return response.status(200).json(migratedMigrations);
  }

  if (request.method === "POST") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrations,
      dryRun: false,
    });

    await dbClient.end();

    if (pendingMigrations.length > 0) {
      return response.status(201).json(pendingMigrations);
    }

    return response.status(200).json(pendingMigrations);
  }

  return response.status(405).json({ error: "Method Not Allowed" });
}
