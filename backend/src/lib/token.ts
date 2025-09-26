import * as jwt from 'jsonwebtoken';
import { env } from '../config/env';

type JoinClaims = { roomId: string };

export function issueJoinToken(roomId: string, expiresIn: string | number = '1h') {
  const payload: JoinClaims = { roomId };
  return jwt.sign(payload, env.JWT_SECRET as jwt.Secret, { expiresIn });
}

export function verifyToken(token: string): { valid: boolean; roomId?: string } {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload & JoinClaims;
    return { valid: true, roomId: decoded.roomId };
  } catch {
    return { valid: false };
  }
}
