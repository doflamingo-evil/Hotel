import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function processMessage(message) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a hotel receptionist.

Speak Malayalam + English.

Return JSON:
{
 "reply": "",
 "name": "",
 "room": "",
 "items": []
}
`
      },
      { role: "user", content: message }
    ]
  });

  return JSON.parse(res.choices[0].message.content);
}
