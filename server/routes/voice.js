import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";
import mongoose from "mongoose";

const router = express.Router();

// Store sessions by phone number in memory
// (safe enough for demo — we'll use MongoDB later)
const sessions = {};

router.post("/", async (req, res) => {
  // Plivo sends caller number as 'From'
  const phone = req.body.From || "unknown";
  const input = req.body.Speech || req.body.SpeechResult || "";

  // Get or create session for this caller
  if (!sessions[phone]) {
    sessions[phone] = { phone, name: "", room: "", items: [] };
  }

  let session = sessions[phone];

  try {
    const ai = await processMessage(input, session);
    
    // Merge AI response into session
    if (ai.name) session.name = ai.name;
    if (ai.room) session.room = ai.room;
    if (ai.items && ai.items.length > 0) session.items = ai.items;

    // Save order if complete
    if (session.name && session.room && session.items.length > 0) {
      await Order.create(session);
      delete sessions[phone]; // clear session after saving
      console.log("Order saved for", phone);
    } else {
      sessions[phone] = session;
    }

    // Plivo XML response
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak language="ml-IN" voice="Aditi">${ai.reply}</Speak>
  <GetInput action="${process.env.RAILWAY_URL}/voice"
            method="POST"
            inputType="speech"
            speechTimeout="3"
            language="ml-IN">
  </GetInput>
</Response>`);

  } catch (err) {
    console.error("Voice route error:", err);
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Speak language="ml-IN">ക്ഷമിക്കണം, ഒരു പ്രശ്നം ഉണ്ടായി. വീണ്ടും ശ്രമിക്കുക.</Speak>
</Response>`);
  }
});

export default router;
