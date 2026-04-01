import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY
});

export async function processMessage(message, session = {}) {
  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
You are a hotel receptionist assistant for a Kerala hotel.
Speak Malayalam primarily. Use English only if the guest uses English.
Your job: collect guest name, room number, and food items they want to order.

Current session info:
Name collected: ${session.name || "not yet"}
Room collected: ${session.room || "not yet"}
Items collected: ${session.items?.join(", ") || "not yet"}

Rules:
- Ask for missing info one at a time
- Be warm and natural like real Kerala hotel staff
- Keep replies SHORT — maximum 2 sentences
- Once you have name, room, and items — confirm the order
- Never make up info

Return ONLY valid JSON, no extra text:
{
  "reply": "what you say to the guest in Malayalam",
  "name": "guest name or empty string",
  "room": "room number or empty string",
  "items": ["item1", "item2"] or []
}
        `
      },
      {
        role: "user",
        content: message || "hello"
      }
    ]
  });

  try {
    const text = res.choices[0].message.content;
    // Strip any markdown formatting just in case
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("AI parse error:", err);
    return {
      reply: "ക്ഷമിക്കണം, മനസ്സിലായില്ല. ഒന്നു കൂടി പറയാമോ?",
      name: session.name || "",
      room: session.room || "",
      items: session.items || []
    };
  }
}
