import database from "infra/database";
import email from "infra/email.js";
import { NotFoundError } from "infra/errors";
import webserver from "infra/webserver.js";

const EXPIRATION_IN_MILLISECONDS = 60 * 15 * 1000; // 15 minutes

async function create(userId) {
  const expiresAt = new Date(Date.now() + EXPIRATION_IN_MILLISECONDS);
  const newToken = await runInsertQuery(userId, expiresAt);
  return newToken;

  async function runInsertQuery(userId, expiresAt) {
    const results = await database.query({
      text: `
        INSERT INTO
          user_activation_tokens (user_id, expires_at)
        VALUES
          ($1, $2)
        RETURNING
          *
        ;`,
      values: [userId, expiresAt],
    });
    return results.rows[0];
  }
}

async function findOneValidByUserId(tokenId) {
  const activationToken = await runSelectQuery(tokenId);
  return activationToken;

  async function runSelectQuery(tokenId) {
    const results = await database.query({
      text: `
        SELECT
          *
        FROM
          user_activation_tokens
        WHERE
          id = $1
          AND expires_at > NOW()
          AND used_at IS NULL
        LIMIT
          1
        ;`,
      values: [tokenId],
    });
    if (results.rowCount === 0) {
      throw new NotFoundError({
        message:
          "O token de ativação utilizado não foi encontrado no sistema ou expirou.",
        action: "Faça um novo cadastro.",
      });
    }
    return results.rows[0];
  }
}

async function sendEmailToUser(user, activationToken) {
  await email.send({
    from: "Douradev <contato@douradev.com.br>",
    to: user.email,
    subject: "Ative seu cadastro",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro
    
${webserver.orgin}/cadastro/ativar/${activationToken.id}

Atenciosamente,
Equipe Douradev`,
  });
}

const activation = {
  create,
  findOneValidByUserId,
  sendEmailToUser,
};

export default activation;
