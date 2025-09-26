# Research: Video call rooms with token-based joining

## Unknowns from Spec (carried by explicit override)
- Token expiry policy (duration, clock skew)
- Token reuse policy (single-use vs multi-use)
- Participant capacity per room
- Join without media allowed?
- Reconnection timeout and strategy
- Notification style (visual-only vs audio chime)
- Default media state (camera/mic on/off)
- User identification approach (display name collection)
- Browser support matrix and localization needs

## Decisions (provisional for planning)
- Token: JWT HS256 signed server-side; include roomId and exp. Exact expiry TBD in /clarify.
- Capacity: Placeholder 12 for MVP; confirm in /clarify.
- Join without media: Allowed; user can toggle on join screen. Confirm in /clarify.
- Reconnection: Exponential backoff attempts for ~30s. Confirm in /clarify.

## Best Practices Notes
- Socket.IO namespaces/rooms map 1:1 with meeting rooms.
- WebRTC: Use getUserMedia with permission prompts; handle device errors gracefully.
- Grid layout: CSS grid with auto-fit, maintain aspect ratio tiles; prioritize active speaker highlighting (future).
- Security: Never log tokens; validate token signature and room scope on join.

## Alternatives Considered
- Next.js for frontend: deferred due to user-approved exception.
- Server-sent events for signaling: not suitable; Socket.IO fits bidirectional needs.
