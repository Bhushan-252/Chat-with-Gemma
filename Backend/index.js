const express = require("express");
const cors = require("cors");
const pool = require("./connection");
const {
  getChats,
  createMessage,
  getMessagesByChatId,
  updateTitle,
} = require("./database");
const app = express();
app.use(express.json());
app.use(cors());
const PORT = 5000;
const updatedTitles = new Set();
let controller = null;
app.post("/api/chat", async (req, res) => {
  try {
    title = "Titles";
    const result = await pool.query(
      "INSERT INTO chats (title) VALUES ($1) RETURNING *",
      [title]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error creating chat" });
  }
});

app.post("/api/chat/:chatId/stop", async (req, res) => {
  try {
    if(controller)
      controller.abort();
    res.status(200).json({ message: "Generation stopped." });
  } catch (error) {
    console.error("Failed to stop generation:", error);
    res.status(500).json({ error: "Failed to stop generation." });
  }
});

app.get("/api/chats", async (req, res) => {
  let data = await getChats();
  res.status(200).json({ data });
});

app.post("/api/chat/:chatId/message", async (req, res) => {
  const chatId = req.params.chatId;
  const { content } = req.body;
  controller = new AbortController()
  const signal = controller.signal;
  if (!content)
    return res.status(400).json({ error: "Message content required" });
  if (!updatedTitles.has(chatId)) {
    updateTitle(chatId, content.trim().slice(0, 20));
    updatedTitles.add(chatId);
  }
  createMessage(chatId, "sender", content);
  let fullText = "";
  let buffer = "";
  const decoder = new TextDecoder("utf-8");
  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:1b",
        prompt: content,
        stream: true,
      }),
      signal: signal,
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: text });
    }
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const reder = response.body.getReader();

    while (true) {
      const { done, value } = await reder.read();
      if (done) break;
      //
      buffer += decoder.decode(value, { stream: true });

      // Try splitting into lines
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep incomplete line in buffer

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          res.write(line);
          const json = JSON.parse(line);
          if (json.response) {
            fullText += json.response;
          }
        } catch (e) {
          console.warn("Skipping invalid JSON chunk:", line);
          console.log("Line that failed:", JSON.stringify(line));
        }
      }
    }
  } catch (err) {
    console.error("Streaming error:", err.message);
  } finally {
    res.end();
    if (fullText.trim()) {
      await createMessage(chatId, "bot", fullText);
    }
  }
});

app.get("/api/chat/:chatId", async (req, res) => {
  const chatId = req.params.chatId;
  const tem = await getMessagesByChatId(chatId);
  res.json({ data: tem });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
