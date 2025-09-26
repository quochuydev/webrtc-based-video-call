import "dotenv/config";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";
import path from "path";
import { Server as IOServer } from "socket.io";
import roomsRouter from "./api/rooms";
import { env } from "./config/env";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(roomsRouter);

console.log(`debug:env`, env);

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // no-op
  });
});

app.post("/api/send", (req, res) => {
  const data = req.body;
  console.log(`debug:data.data`, data.type, !!data.data);
  io.sockets.emit(data.type, data.data);
  res.status(200).json({ send: true, data: data.data });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  const distPath = path.join(process.cwd(), "/frontend/dist");
  console.log(`debug:distPath`, distPath);

  app.use(express.static(distPath));

  app.use("*all", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(env.PORT, () => {
  console.log(`http://localhost:${env.PORT}`);
});
