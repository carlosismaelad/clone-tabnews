import email from "infra/email.js";

async function sendEmailToUser(user) {
  await email.send({
    from: "Douradev <contato@douradev.com.br>",
    to: user.email,
    subject: "Ative seu cadastro",
    text: `${user.username}, clique no link abaixo para ativar seu cadastro
    
https://link...
Atenciosamente,
Equipe Douradev`,
  });
}

const activation = {
  sendEmailToUser,
};

export default activation;
