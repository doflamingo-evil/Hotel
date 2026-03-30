import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";

const router = express.Router();

let session = {};

router.post("/", async (req, res) => {
  const input = req.body.SpeechResult || "";

  const ai = await processMessage(input);

  // update session
  session = { ...session, ...ai };

  // if order complete → save
  if (session.name && session.room && session.items?.length) {
    await Order.create(session);
  }

  res.send(`
    <Response>
      <Say>${ai.reply}</Say>
      <Gather input="speech" action="/voice"/>
    </Response>
  `);
});

export default router;
