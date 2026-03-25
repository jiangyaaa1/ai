import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";

// Keep track of connected SSE clients
let clients: express.Response[] = [];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // SSE endpoint for frontend to listen to remote commands
  app.get("/api/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    clients.push(res);

    req.on("close", () => {
      clients = clients.filter((client) => client !== res);
    });
  });

  // Webhook endpoint for Feishu or other remote software
  app.post("/api/webhook/feishu", (req, res) => {
    try {
      const body = req.body;
      
      // Handle Feishu URL verification challenge
      if (body.type === "url_verification") {
        return res.json({ challenge: body.challenge });
      }

      // Extract message from Feishu event
      let command = "";
      if (body.header && body.header.event_type === "im.message.receive_v1") {
        const messageContent = JSON.parse(body.event.message.content);
        command = messageContent.text || "";
      } else if (body.command) {
        // Generic webhook fallback
        command = body.command;
      }

      if (command) {
        // Broadcast to all connected clients
        clients.forEach((client) => {
          client.write(`data: ${JSON.stringify({ type: "REMOTE_COMMAND", command })}\n\n`);
        });
        res.json({ status: "success", message: "Command broadcasted" });
      } else {
        res.status(400).json({ status: "error", message: "No command found" });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ status: "error", message: "Internal server error" });
    }
  });

  // Vite middleware for development
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
