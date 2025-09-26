# Feature Specification: Video call rooms with token-based joining and grid view

**Feature Branch**: `001-i-wanna-build`  
**Created**: 2025-09-25 15:32 (+07:00)  
**Status**: Draft  
**Input**: User description: "i wanna build a video call app, user create room, other participant can join and leave. using tsx nodejs socket io, fe use react vite with socket io and webrtc. app router: rooms for create room and rooms/[id] validate ?token=jwt_token to join, render grid view like google meet"

## Execution Flow (main)

```
1. Parse user description from Input
   → If empty: ERROR "No feature description provided"
2. Extract key concepts from description
   → Identify: actors (host/participant), actions (create, join, leave), data (room, join token), constraints (token validation, grid view)
3. For each unclear aspect:
   → Mark with [NEEDS CLARIFICATION: specific question]
4. Fill User Scenarios & Testing section
   → If no clear user flow: ERROR "Cannot determine user scenarios"
5. Generate Functional Requirements
   → Each requirement must be testable
   → Mark ambiguous requirements
6. Identify Key Entities (data involved)
7. Run Review Checklist
   → If any [NEEDS CLARIFICATION]: WARN "Spec has uncertainties"
   → If implementation details found: ERROR "Remove tech details"
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines

- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

### Section Requirements

- **Mandatory sections**: Must be completed for every feature
- **Optional sections**: Include only when relevant to the feature
- When a section doesn't apply, remove it entirely (don't leave as "N/A")

### For AI Generation

When creating this spec from a user prompt:

1. **Mark all ambiguities**: Use [NEEDS CLARIFICATION: specific question] for any assumption you'd need to make
2. **Don't guess**: If the prompt doesn't specify something (e.g., auth method details), mark it
3. **Think like a tester**: Every vague requirement should fail the "testable and unambiguous" checklist item
4. **Common underspecified areas**:
   - User types and permissions
   - Data retention/deletion policies
   - Performance targets and scale
   - Error handling behaviors
   - Integration requirements
   - Security/compliance needs

---

## User Scenarios & Testing (mandatory)

### Primary User Story

As a user, I want to create a video call room and invite others to join via a token-protected link so that we can meet in real time and see each other in a grid layout similar to Google Meet.

### Acceptance Scenarios

1. **Given** I am on the rooms landing page, **When** I create a new room, **Then** I receive a shareable join link containing a token parameter and I am taken into the room.
2. **Given** I have a valid join link with token, **When** I open the link, **Then** I am admitted into the specified room and can see/hear other participants in a grid layout.
3. **Given** I have an invalid or missing token, **When** I attempt to join a room, **Then** I am prevented from joining and shown a clear error message with next steps.
4. **Given** multiple participants are in the room, **When** a new participant joins, **Then** all current participants see the new participant tile appear and can see/hear them.
5. **Given** I am in a room, **When** I leave the room, **Then** my tile disappears for others and my session ends cleanly.
6. **Given** I have denied camera/microphone permissions, **When** I try to join the room, **Then** I am prompted to enable permissions and given guidance to proceed or join without media if allowed. [NEEDS CLARIFICATION: is join without media allowed?]
7. **Given** I have a valid token that has expired, **When** I try to join, **Then** I am blocked and shown an error explaining the token is expired. [NEEDS CLARIFICATION: token expiry policy]
8. **Given** the room has reached its participant limit, **When** I try to join, **Then** I am prevented from joining and informed the room is full. [NEEDS CLARIFICATION: participant limit]
9. **Given** my network drops temporarily, **When** connectivity resumes, **Then** I am automatically reconnected to the room without manual refresh, where feasible. [NEEDS CLARIFICATION: reconnection timeout behavior]
10. **Given** I am the room creator, **When** I end the meeting (if supported), **Then** all participants are disconnected and informed the room has ended. [NEEDS CLARIFICATION: can creators end rooms for everyone?]

### Edge Cases

- Token reuse after leaving and rejoining (replay protection). [NEEDS CLARIFICATION: can the same token be used multiple times or is it single-use?]
- Opening the same join link in multiple tabs/devices simultaneously.
- Unsupported browsers or devices (older mobile, no media device available).
- Handling echo/feedback when joining with multiple devices in proximity.
- Screen name duplication (two users with the same display name). [NEEDS CLARIFICATION: are display names collected?]
- Host (room creator) leaving: does the room persist or auto-end?
- Abuse/harassment controls (mute others, remove participants). [NEEDS CLARIFICATION]
- Privacy: camera off by default vs on by default. [NEEDS CLARIFICATION]

## Requirements (mandatory)

### Functional Requirements

- **FR-001**: Users MUST be able to create a new meeting room from a dedicated entry point.
- **FR-002**: The system MUST generate a shareable join link that includes a token parameter tied to the target room.
- **FR-003**: The system MUST validate the token on room join and allow access only when the token is valid according to policy (format, scope, expiry, integrity).
- **FR-004**: Users MUST be able to join a room via the shareable link and leave the room at any time.
- **FR-005**: The room MUST support real-time audio and video communication among all participants currently joined.
- **FR-006**: The UI MUST render participants in a dynamic grid layout that adapts to the number of participants, similar in concept to Google Meet.
- **FR-007**: The system MUST update the participant grid in near real time when participants join or leave.
- **FR-008**: The system MUST clearly indicate a participant’s media states (camera on/off, microphone muted/unmuted) to all participants.
- **FR-009**: The system MUST provide clear error and guidance messages when access is denied (invalid/expired token) or when media permissions are unavailable.
- **FR-010**: The system SHOULD automatically attempt to reconnect participants after transient network interruptions, preserving room state where possible. [NEEDS CLARIFICATION: reconnection strategy and limits]
- **FR-011**: The system MUST prevent access to a room when the room has reached its configured participant capacity. [NEEDS CLARIFICATION: capacity]
- **FR-012**: The system MUST provide a means to share the join link with others (e.g., copy to clipboard UX).
- **FR-013**: The system MUST notify current participants when a new participant joins or an existing participant leaves (visual change is sufficient; audible chime is optional). [NEEDS CLARIFICATION: notification style]
- **FR-014**: The system MUST handle user permissions for camera and microphone in a privacy-conscious manner, guiding users to enable them when required. [NEEDS CLARIFICATION: default media state]
- **FR-015**: The system MUST restrict room access strictly to the target room specified in the token to prevent cross-room access.
- **FR-016**: The system SHOULD support basic participant identity display (e.g., display name or initials) to distinguish tiles. [NEEDS CLARIFICATION: user identification approach]

### Non-Functional / Constraints

- **NFR-001**: Availability and latency targets for media and signaling MUST be defined. [NEEDS CLARIFICATION: acceptable join time, media start time, and A/V latency targets]
- **NFR-002**: The system SHOULD be accessible on modern desktop and mobile browsers; explicitly list supported versions. [NEEDS CLARIFICATION: browser support matrix]
- **NFR-003**: The system MUST present clear, localized messages for common errors and permission prompts. [NEEDS CLARIFICATION: localization requirements]
- **NFR-004**: The system MUST consider privacy defaults and provide user controls for media states.

### Security & Compliance

- **SEC-001**: Join tokens MUST be integrity-protected and verifiable (e.g., signed), scoped to a specific room, and time-bound. [NEEDS CLARIFICATION: token issuer, expiry duration, clock skew]
- **SEC-002**: The system MUST prevent token tampering and replay to the extent feasible. [NEEDS CLARIFICATION: single-use vs multi-use tokens; revocation]
- **SEC-003**: The system MUST avoid exposing sensitive data in URLs beyond the required token parameter and MUST not log tokens in analytics or error logs. [NEEDS CLARIFICATION: observability policies]
- **SEC-004**: The system SHOULD provide safeguards against abuse (rate limits for join attempts, optional room lock). [NEEDS CLARIFICATION]

### Out of Scope (initial release)

- Recording, chat, screen sharing, reactions, hand-raise, and admin moderation tools beyond join/leave. [Future consideration unless explicitly requested]

### Key Entities (data)

- **Room**: A meeting space identified by an ID; tracks active state and participant capacity policy; may have a creator/owner.
- **Participant**: A user connected to a room with media states (camera/mic) and a display identifier.

---

## Review & Acceptance Checklist

_GATE: Automated checks run during main() execution_

### Content Quality

- [ ] No implementation details (languages, frameworks, APIs)
- [ ] Focused on user value and business needs
- [ ] Written for non-technical stakeholders
- [ ] All mandatory sections completed

### Requirement Completeness

- [ ] No [NEEDS CLARIFICATION] markers remain
- [ ] Requirements are testable and unambiguous
- [ ] Success criteria are measurable
- [ ] Scope is clearly bounded
- [ ] Dependencies and assumptions identified

---

## Execution Status

_Updated by main() during processing_

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [ ] Review checklist passed

---
