import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Invalid messages body" });
        return;
      }

      // 1. Find the first user message. Conversation sent to Gemini must start with a 'user' message.
      const firstUserIndex = messages.findIndex((m: any) => m.sender === 'user');
      const apiMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex) : [];

      if (apiMessages.length === 0) {
        res.json({ text: "Please enter a question to start the compliance analysis.", reply: "Please enter a question to start the compliance analysis." });
        return;
      }

      // 2. Map and group consecutive messages of the same role to strictly alternate user/model
      const contents: any[] = [];
      for (const m of apiMessages) {
        const role = m.sender === 'user' ? 'user' : 'model';
        const text = m.text || '';
        
        if (contents.length > 0 && contents[contents.length - 1].role === role) {
          // Merge consecutive messages from the same sender
          contents[contents.length - 1].parts[0].text += "\n" + text;
        } else {
          contents.push({
            role,
            parts: [{ text }]
          });
        }
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction: "You are a sovereign compliance advisor for the Tanzania Investment and Procurement Portal. Answer questions about Tanzanian investment law, procurement regulations (CAP 410), tax incentives, SEZ/EPZ rules, local content requirements, and market entry pathways. Be concise, structured, and cite specific regulatory references. Keep responses under 200 words.",
        }
      });

      res.json({ text: response.text, reply: response.text });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
