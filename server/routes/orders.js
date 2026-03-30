import express from "express";
import Order from "../models/order.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
