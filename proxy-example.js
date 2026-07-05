/**
 * Minimal backend proxy for the ¡Habla! app.
 *
 * Why this exists: the APK is a client — anyone can decompile it and read
 * any string baked into it, including an API key. This tiny server sits
 * between the app and Anthropic's API: the app calls THIS server, and this
 * server (which you control, and which holds the real key as an
 * environment variable, never in code) calls Anthropic on its behalf.
 *
 * Deploy this anywhere that can run Node (Render, Railway, Fly.io, a
 * DigitalOcean droplet, a Vercel/Netlify serverless function, etc).
 * Then set CLAUDE_ENDPOINT in src/App.jsx to wherever this ends up living,
 * e.g. "https://habla-proxy.onrender.com/api/claude".
 *
 * ---- Setup ----
 *   npm install express cors
 *   export ANTHROPIC_API_KEY=sk-ant-xxxxxxxx   (get one from console.anthropic.com)
 *   node proxy-example.js
 */

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PORT = process.env.PORT || 3001;

if (!ANTHROPIC_API_KEY) {
  console.warn(
    "WARNING: ANTHROPIC_API_KEY is not set. Requests to /api/claude will fail until you set it."
  );
}

app.post("/api/claude", async (req, res) => {
  try {
    const { messages, system, max_tokens } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: max_tokens || 800,
        system,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(response.status).json(data);
    }

    // Pass through in the same shape the app already expects: { content: [...] }
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Something went wrong talking to Claude." });
  }
});

app.get("/", (_req, res) => {
  res.send("Habla proxy is running. POST to /api/claude.");
});

app.listen(PORT, () => {
  console.log(`Habla proxy listening on port ${PORT}`);
});
