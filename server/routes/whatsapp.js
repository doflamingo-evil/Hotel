import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";

const router = express.Router();

// Store WhatsApp sessions by phone
const sessions = {};

router.post("/", async (req, res) => {
  // Wati sends: waId = phone, text = message
  const phone = req.body.waId || req.body.From || "unknown";
  const input = req.body.text || req.body.Body || "";

  if (!input) {
    return res.json({ reply: "നമസ്കാരം! എന്ത് സഹായം വേണം? 🙏" });
  }

  // Get or create session
  if (!sessions[phone]) {
    sessions[phone] = { phone, name: "", room: "", items: [] };
  }

  let session = sessions[phone];

  try {
    const ai = await processMessage(input, session);

    // Merge into session
    if (ai.name) session.name = ai.name;
    if (ai.room) session.room = ai.room;
    if (ai.items && ai.items.length > 0) session.items = ai.items;

    // Save if order complete
    if (session.name && session.room && session.items.length > 0) {
      await Order.create(session);
      delete sessions[phone];
      console.log("WhatsApp order saved for", phone);
    } else {
      sessions[phone] = session;
    }

    // Wati expects this format
    res.json({ reply: ai.reply });

  } catch (err) {
    console.error("WhatsApp error:", err);
    res.json({ reply: "ക്ഷമിക്കണം, ഒരു പ്രശ്നം ഉണ്ടായി. വീണ്ടും ശ്രമിക്കുക." });
  }
});

export default router;
