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

// MongoDB connect
mongoose.connect(process.env.MONGO_URI);

// routes
app.use("/voice", voiceRoute);
app.use("/orders", orderRoute);

app.listen(3000, () => console.log("Server running"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
