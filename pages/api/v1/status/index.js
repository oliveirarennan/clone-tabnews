import database from "infra/database";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const databaseVersionResult = await database.query("show server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;
  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections;"
  );

  const databaseName = process.env.POSTGRES_DB

  const databaseMaxConnectionsValue = 
    databaseMaxConnectionsResult.rows[0].max_connections;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName]
  });

  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: Number(databaseMaxConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}

export default status;
