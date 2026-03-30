import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import voiceRoute from "./routes/voice.js";
import orderRoute from "./routes/orders.js";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// MongoDB connect (safe version)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));
}

// routes
app.use("/voice", voiceRoute);
app.use("/orders", orderRoute);

// ROOT route (for testing)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

// IMPORTANT: use Railway port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
