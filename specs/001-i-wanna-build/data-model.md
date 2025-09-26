# Data Model

## Entities

### Room

- id: string (UUID)
- createdAt: ISO datetime
- capacity: number (default 12, configurable)
- active: boolean

### Participant

- id: string (UUID)
- roomId: string
- displayName: string
- media: { cameraOn: boolean, micOn: boolean }
- joinedAt: ISO datetime
