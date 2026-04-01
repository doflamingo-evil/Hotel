import express from "express";
import { processMessage } from "../services/ai.js";
import Order from "../models/order.js";

const router = express.Router();
let session = {};

// Vapi calls this when a call starts
router.post("/", async (req, res) => {
  const msg = req.body.message;

  // New call — send assistant config
  if (msg?.type === "assistant-request") {
    return res.json({
      assistant: {
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          messages: [{
            role: "system",
            content: `You are a hotel receptionist. Speak Malayalam + English. 
            When you have the guest's name, room number, and order items, confirm the order.`
          }]
        },
        voice: {
          provider: "playht",
          voiceId: "jennifer"
        },
        firstMessage: "Hello! Welcome to the hotel. How can I help you today?"
      }
    });
  }

  // Handle conversation transcript
  if (msg?.type === "transcript" && msg.transcript) {
    const ai = await processMessage(msg.transcript);
    session = { ...session, ...ai };

    if (session.name && session.room && session.items?.length) {
      await Order.create(session);
      session = {};
    }
  }

  res.sendStatus(200);
});

export default router;
