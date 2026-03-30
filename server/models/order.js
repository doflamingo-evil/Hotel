import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  room: String,
  items: [String],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
