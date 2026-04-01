import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";

const router = express.Router();
let session = {};

// Plivo calls this when someone calls your number
router.post("/", async (req, res) => {
  // Plivo sends speech as 'Speech' not 'SpeechResult'
  const input = req.body.Speech || req.body.SpeechResult || "";

  const ai = await processMessage(input);
  session = { ...session, ...ai };

  // Save order if complete
  if (session.name && session.room && session.items?.length) {
    await Order.create(session);
    session = {}; // reset after saving
  }

  // Plivo XML response (nearly identical to TwiML)
  res.set("Content-Type", "text/xml");
  res.send(`
    <Response>
      <Speak language="ml-IN" voice="Aditi">${ai.reply}</Speak>
      <GetInput action="https://YOUR_RAILWAY_URL/voice"
                method="POST"
                inputType="speech"
                speechTimeout="3"
                language="ml-IN">
      </GetInput>
    </Response>
  `);
});

export default router;
