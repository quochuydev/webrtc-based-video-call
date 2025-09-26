import "dotenv/config";

import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Server as IOServer } from "socket.io";
import { env } from "./config/env";
import roomsRouter from "./api/rooms";
import bodyParser from "body-parser";
import path from "path";

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(roomsRouter);

const server = http.createServer(app);
const io = new IOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // no-op
  });
});

const distPath = path.join(__dirname, "../../frontend/dist");
console.log(`debug:distPath`, distPath);
console.log(`debug:NODE_ENV`, process.env.NODE_ENV);

app.post("/api/send", (req, res) => {
  const data = req.body;
  console.log(`debug:data.data`, data.type, !!data.data);
  io.sockets.emit(data.type, data.data);
  res.status(200).json({ send: true, data: data.data });
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));

  app.use("*all", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

server.listen(env.PORT, () => {
  console.log(`backend listening on ${env.PORT}`);
});
