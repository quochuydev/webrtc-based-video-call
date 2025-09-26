# Quickstart Scenarios

## Create and Join a Room
1. Open `/rooms` in the frontend.
2. Click "Create Room".
3. App calls POST `/rooms`; response includes `roomId` and a `joinUrl` with `?token=...`.
4. Share the link. Open `/rooms/[id]?token=...`.
5. If token is valid, join the room; see grid with yourself and others.

## Error: Invalid or Expired Token
1. Navigate to `/rooms/[id]?token=bad`.
2. Backend responds 401 with message.
3. UI shows friendly error and action to request a new link.

## Leave and Rejoin
1. While in a room, click "Leave".
2. Socket disconnects; others see your tile removed.
3. Use the same link to rejoin (subject to token policy and expiry).
