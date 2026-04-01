import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import voiceRoute from "./routes/voice.js";
import orderRoute from "./routes/orders.js";
import whatsappRoute from "./routes/whatsapp.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connect
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));
}

// Routes
app.use("/voice", voiceRoute);
app.use("/orders", orderRoute);
app.use("/whatsapp", whatsappRoute);

// Health check
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
