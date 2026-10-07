import database from "infra/database.js";
import orchestrator from "tests/orchestrator.js";

const dotEnv = require("dotenv");
dotEnv.config({ path: "./.env.test" });

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query("DROP SCHEMA public CASCADE");
  await database.query("CREATE SCHEMA public");
});

test("POST to /api/v1/migrations should return 200 OK", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const responseBody = await response1.json();
  expect(Array.isArray(responseBody)).toBe(true);
  // expect(responseBody.length).toBe(0);
});

test("POST to /api/v1/migrations should return 200 OK", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBe(0);
});
