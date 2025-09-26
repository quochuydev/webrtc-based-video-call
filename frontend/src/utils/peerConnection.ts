export type IceCandidate = {
  candidate: string;
  sdpMLineIndex: number | null;
  sdpMid: string | null;
  usernameFragment: string | null;
};

const servers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

let pc: RTCPeerConnection | null;
let callStarter: boolean = false;

export const setupPeerConnection = () => {
  pc = new RTCPeerConnection(servers);
  return pc;
};

export const getPeerConnection = () => {
  if (pc) return pc;
  return setupPeerConnection();
};

export const getCallStarterStatus = () => {
  return callStarter;
};

export const closePeerConnection = async () => {
  if (pc) {
    pc!.close();
    pc = null;
  }
};

export const setupTheOffer = async (): Promise<RTCSessionDescriptionInit> => {
  callStarter = true;
  if (!pc) await setupPeerConnection();

  const offerDescription = await pc!.createOffer();
  await pc!.setLocalDescription(offerDescription);

  return offerDescription;
};

export const peerSetRemoteDescription = async (description: any) => {
  if (!pc) await setupPeerConnection();

  const answerDescription = new RTCSessionDescription({
    sdp: description.sdp,
    type: description.type as RTCSdpType,
  });

  await pc!.setRemoteDescription(answerDescription);
};

export const setupTheAnswer = async (
  offerDescription: any
): Promise<RTCSessionDescriptionInit> => {
  if (!pc) await setupPeerConnection();

  const description = new RTCSessionDescription({
    sdp: offerDescription.sdp,
    type: offerDescription.type as RTCSdpType,
  });
  await pc!.setRemoteDescription(description);

  const answerDescription = await pc!.createAnswer();
  await pc!.setLocalDescription(answerDescription);

  return answerDescription;
};

export const addIce = async (iceCandidate: IceCandidate) => {
  if (!pc) await setupPeerConnection();

  if (
    iceCandidate != null &&
    iceCandidate.candidate != null &&
    iceCandidate.sdpMLineIndex != null &&
    iceCandidate.sdpMid != null &&
    iceCandidate.usernameFragment != null &&
    pc!.remoteDescription != null
  ) {
    let candidate = new RTCIceCandidate({
      candidate: iceCandidate.candidate,
      sdpMid: iceCandidate.sdpMid,
      sdpMLineIndex: iceCandidate.sdpMLineIndex,
      usernameFragment: iceCandidate.usernameFragment,
    });
    pc!.addIceCandidate(candidate);
  }
};

export const peerConnectionIcecandidate = async (params: {
  roomId: string;
  roomMemberId: string;
  onHandleCandidate: (params: {
    candidate: string;
    sdpMid: string | null;
    sdpMLineIndex: number | null;
    usernameFragment: string | null;
  }) => Promise<void>;
}) => {
  const { onHandleCandidate } = params;
  // console.log(`debug:pc`, !!pc);

  if (!pc) await setupPeerConnection();

  pc!.onicecandidate = async (event) => {
    if (event.candidate) {
      const candidate = {
        candidate: event.candidate.candidate,
        sdpMid: event.candidate.sdpMid,
        sdpMLineIndex: event.candidate.sdpMLineIndex,
        usernameFragment: event.candidate.usernameFragment,
      };
      await onHandleCandidate(candidate);
    }
  };

  pc!.onconnectionstatechange = (event) => {
    console.log("connectionstatechange", event.target);
  };

  pc!.onsignalingstatechange = (event) => {
    console.log("onsignalingstatechange", event.target);
  };

  pc!.addEventListener("iceconnectionstatechange", (event) => {
    // console.log("iceConnectionState", event.target!);
  });

  pc!.ondatachannel = (event) => {
    const dataChannel = event.channel;
    // console.log(`debug:dataChannel`, dataChannel);
  };
};

export const setupStream = async ({
  localStreamData,
  remoteVideo,
}: {
  localStreamData: MediaStream;
  remoteVideo: HTMLVideoElement;
}) => {
  if (!pc) await setupPeerConnection();

  localStreamData.getTracks().forEach((track) => {
    pc!.addTrack(track, localStreamData);
  });

  const remoteStream = new MediaStream();

  remoteVideo.srcObject = remoteStream;

  pc!.ontrack = (ev: any) => {
    // console.log(`debug:ev.streams`, !!ev.streams?.[0]);

    if (ev.streams && ev.streams[0]) {
      remoteVideo.srcObject = ev.streams[0];
    } else {
      let inboundStream = new MediaStream(ev.track);
      remoteVideo.srcObject = inboundStream;
    }
  };
};

let dataChannel: RTCDataChannel;
/**
 *
 * @param iceCandidate
 */
export const setupDataChannel = async (roomId: string) => {
  if (!pc) await setupPeerConnection();

  dataChannel = pc!.createDataChannel(roomId);

  dataChannel.onopen = (event) => {
    console.log("open", event);
  };

  dataChannel.onclose = (event) => {
    console.log("onclose", event);
  };

  dataChannel.onmessage = (event) => {
    console.log("dataChannel message", event, event.data);
  };

  dataChannel.onerror = (event) => {
    console.log("on error", event);
  };

  return dataChannel;
};

export const getDataChannel = async (roomId: string) => {
  if (dataChannel) return dataChannel;
  return setupDataChannel(roomId);
};
