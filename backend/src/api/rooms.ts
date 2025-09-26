import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { issueJoinToken, verifyToken } from "../lib/token";
import { env } from "../config/env";

const router = Router();

router.post("/api/rooms", (_req, res) => {
  const roomId = uuidv4();
  const token = issueJoinToken(roomId);
  const joinUrl = `${env.APP_URL}/rooms/${roomId}?token=${token}`;
  res.status(201).json({ roomId, joinUrl });
});

router.get("/api/rooms/:id", (req, res) => {
  const { id } = req.params;
  const token = req.query.token as string;

  if (!token) return res.status(401).json({ error: "Missing token" });

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
