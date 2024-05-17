import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json());
configDotenv();

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

app.post("/ThiagoAI", async (req, res) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });


  const chat = model.startChat({
    history: req.body.history,
  });

  const msg = req.body.message;

  try {
    const { response } = await chat.sendMessage(msg);
    const text = response.text();
    res.json({ message: text });
  } catch (error) {
    console.error("Error :", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("app listenx on port 5000", process.env.API_KEY);
});
