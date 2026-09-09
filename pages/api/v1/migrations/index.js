import migrationRunner from "node-pg-migrate";
import { join } from "node:path";
import database from "infra/database.js";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({ error: `Method "${request.method}" Not Allowed` });
  }

  let dbClient;
  try {
    dbClient = await database.getNewClient();

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
      return response.status(200).json(migratedMigrations);
    }

    if (request.method === "POST") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrations,
        dryRun: false,
      });

      if (pendingMigrations.length > 0) {
        return response.status(201).json(pendingMigrations);
      }
      return response.status(200).json(pendingMigrations);
    }
    return response.status(405).end();
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
