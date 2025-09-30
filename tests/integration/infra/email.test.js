import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("SEND", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "Douradev <contato@douradev.com.br>",
      to: "contato@client.dev",
      subject: "First email sent",
      text: "Body Of The First Email",
    });
    await email.send({
      from: "Douradev <contato@douradev.com.br>",
      to: "contato@client.dev",
      subject: "Last Email Sent",
      text: "Body Of The Last Email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toEqual("<contato@douradev.com.br>");
    expect(lastEmail.recipients[0]).toEqual("<contato@client.dev>");
    expect(lastEmail.subject).toEqual("Last Email Sent");
    expect(lastEmail.text).toEqual("Body Of The Last Email.\n");
  });
});
