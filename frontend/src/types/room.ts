export type User = {
  id: string;
  ip: string;
  name: string;
  Room?: Room[];
  isBlocked: boolean;
  RoomMember?: RoomMember[];
};

export type Room = {
  id: string;
  ownerId: string;
  name: string;
  isActive: boolean;
  RoomMember?: RoomMember[];
};

export type RoomMember = {
  id: string;
  memberId: string;
  roomId: string;
  Description?: Description[];
  Candidate?: Candidate[];
};

export type Description = {
  id: string;
  roomMemberId: string;
  type: string;
  sdp: string;
  dataType: TypeStatus;
};

export type Candidate = {
  id: string;
  roomMemberId: string;
  candidate: string;
  sdpMLineIndex?: number;
  sdpMid?: string;
  usernameFragment?: string;
  dataType: TypeStatus;
};

export type IceCandidate = {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
  usernameFragment: string | null;
};

export type PCDescription = {
  sdp: string | undefined;
  type: RTCSdpType;
};

export type TypeStatus = "Offer" | "Answer";

export type RoomMembers = {
  [id: string]: RoomMember;
};
