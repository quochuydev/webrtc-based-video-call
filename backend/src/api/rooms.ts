import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env";
import { issueJoinToken, verifyToken } from "../lib/token";

const router = Router();

// POST /rooms → create a room and return a join URL with token
router.post("/rooms", (_req, res) => {
  const roomId = uuidv4();
  const token = issueJoinToken(roomId);

  const base = env.BASE_URL.replace(/\/$/, "");
  const joinUrl = `http://localhost:5173/rooms/${roomId}?token=${token}`;

  res.status(201).json({ roomId, joinUrl });
});

// GET /rooms/:id?token=...
router.get("/rooms/:id", (req, res) => {
  const { id } = req.params;
  const token = (req.query.token as string) || "";
  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }
  const result = verifyToken(token);
  if (!result.valid) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
  if (result.roomId !== id) {
    return res.status(404).json({ error: "Room not found" });
  }
  return res.status(200).json({ roomId: id, valid: true });
});

export default router;
