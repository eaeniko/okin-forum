const { exec } = require("node:child_process");

function checkPostgresReady() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgresReady();
      return;
    }
    console.log("\n🟢 Postgres is accepting connections!\n");
  }
}
console.log("\n\n🔴 Postgres is not ready yet. Retrying in 1 second");
checkPostgresReady();
