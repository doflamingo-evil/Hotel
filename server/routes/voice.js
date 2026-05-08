import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";

const router = express.Router();

let session = {};

router.post("/", async (req, res) => {
  try {
    // Exotel sends speech input as 'SpeechResult'
    const input = req.body.SpeechResult || "";

    const ai = await processMessage(input);
    session = { ...session, ...ai };

    // If we have all order details, save to database
    if (session.name && session.room && session.items?.length) {
      await Order.create(session);
      session = {}; // reset session after saving
    }

    // Respond with Exotel/Twilio compatible XML
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say language="ml-IN">${ai.reply}</Say>
        <Gather input="speech" action="/voice" language="ml-IN" speechTimeout="3">
        </Gather>
      </Response>
    `);
  } catch (err) {
    console.error("Voice route error:", err);
    res.set("Content-Type", "text/xml");
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say>Sorry, something went wrong. Please try again.</Say>
      </Response>
    `);
  }
});

export default router;
