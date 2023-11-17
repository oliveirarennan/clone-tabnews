import database from "infra/database";

async function status(request, response) {
  const result = await database.query("SELECT 1 + 1 as sum;");
  console.log(result.rows);
  response
    .status(200)
    .json({ chave: "os alunos do curso.dev são acima da média" });
}

export default status;
