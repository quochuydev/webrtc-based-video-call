import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
("use client");
import {
  addIce,
  closePeerConnection,
  getCallStarterStatus,
  getPeerConnection,
  peerConnectionIcecandidate,
  peerSetRemoteDescription,
  setupDataChannel,
  setupTheAnswer,
  setupTheOffer,
} from "@/utils/peerConnection";
import { Card, CardContent } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import MicrophoneSVG from "@/assets/icons/microphone";
import MicrophoneOffSVG from "@/assets/icons/microphoneOff";
import VideoSVG from "@/assets/icons/video";
import VideoOffSVG from "@/assets/icons/videoOff";
import EndCallSVG from "@/assets/icons/endCall";
import CallerUserSVG from "@/assets/icons/callerUserSVG";
import { useStream } from "@/contexts/stream";
import type { PCDescription } from "@/types/room";
import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const WS_BASE = import.meta.env.VITE_WS_BASE || "ws://localhost:4000";

export default function RoomCall() {
  const { id } = useParams<{ id: string }>();

  const socket = io(WS_BASE);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [offer, setOffer] = useState<any | null>(null);
  const [remoteVideo, setRemoteVideo] = useState<HTMLVideoElement>();
  const [localVideo, setLocalVideo] = useState<HTMLVideoElement>();

  const roomLabel = useMemo(() => id ?? "unknown", [id]);

  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);

  const {
    localStream,
    setStream,
    remoteStream,
    remoteStreams,
    pauseAudio,
    pauseVideo,
    resumeAudio,
    resumeVideo,
    stopMediaStream,
  } = useStream();

  async function endCallFunction() {
    await stopMediaStream();

    await fetch(`${API_BASE}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "close", data: {} }),
    });

    await closePeerConnection();
  }

  const handleBeforeUnload = (e: any) => {
    endCallFunction();
    e.returnValue = "Closing this window will end the call";
    e.preventDefault();
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const t = qs.get("token");

    if (!t) {
      setError("Missing token in URL (?token=...)");
    } else {
      setToken(t);
    }

    socket.io.on("reconnect", (attempt) => {
      console.log(`debug:reconnected`);
    });

    socket.on("offer", async (offer) => {
      if (!t) {
        console.log(`debug:ANSWER_OFFER`);

        const answer = await setupTheAnswer({
          sdp: offer.sdp,
          type: offer.type as RTCSdpType,
        });

        await fetch(`${API_BASE}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "description", data: answer }),
        });
      }
    });

    socket.on("candidate", async (data) => {
      addIce({ ...data });
    });

    socket.on("description", async (data) => {
      if (t) {
        console.log(`debug:ANSWERED`, data);

        peerSetRemoteDescription(data);
      }
    });

    socket.on("close", async () => {
      endCallFunction();
    });
  }, []);

  useEffect(() => {
    setupChannel();
  }, [token]);

  const setupChannel = async () => {
    setLoading(true);

    await setStream();
    await setupDataChannel("room-1");

    const pc = getPeerConnection();

    await peerConnectionIcecandidate({
      roomId: "room-1",
      roomMemberId: "roomMemberId",
      onHandleCandidate: async (candidate) => {
        await fetch(`${API_BASE}/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type: "candidate", data: candidate }),
        });
      },
    });

    if (token) {
      console.log(`debug:START_SEND_OFFER`);
      // OWNER
      const offerDescription = await setupTheOffer();

      const offer: PCDescription = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      console.log(`debug:offer`, !!offer);

      await fetch(`${API_BASE}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "offer", data: offer }),
      });
    }

    pc.addEventListener("negotiationneeded", async (event) => {
      const creator = getCallStarterStatus();
      console.log(`debug:negotiationneeded`, creator);
    });

    setLoading(false);
  };

  useEffect(() => {
    if (remoteStream) {
      const remoteVideoData = document.getElementById(
        "remoteStream"
      ) as HTMLVideoElement;

      if (remoteVideoData && remoteVideoData instanceof HTMLVideoElement) {
        remoteVideoData.srcObject = remoteStream;
      }
    }
  }, [remoteStream]);

  useEffect(() => {
    if (localStream) {
      const localVideoData = document.getElementById(
        "localStream"
      ) as HTMLVideoElement;

      if (localVideoData && localVideoData instanceof HTMLVideoElement) {
        localVideoData.srcObject = localStream;
      }
    }
  }, [localStream]);

  return (
    <main className="flex w-screen h-screen items-top justify-center min-w-[320px] min-h-[500px] ">
      {loading && (
        <div className="z-20 bg-background absolute h-screen w-screen gap-x-5 flex justify-center items-center">
          <p className="animate-bounce text-4xl duration-500 delay-500">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-100">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-500">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-100">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-500">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-100">::</p>
          <p className="animate-bounce text-4xl duration-500 delay-500">::</p>
        </div>
      )}

      <div className="max-w-[1280px] relative w-full h-full flex flex-col justify-start items-top px-[3%] pt-0 space-y-4">
        <h1>Room {roomLabel}</h1>
        {!error && !token && <p>Loading…</p>}
        {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

        <div className="max-h-[900px] h-[91%] w-full bg-green-200 rounded-md relative overflow-hidden mt-4">
          {/* remote participants */}
          <div
            className="hidden w-full h-full grid gap-2 p-2"
            style={{
              gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
            }}
          >
            {remoteStreams.length > 0 ? (
              remoteStreams.map((peer) => (
                <div
                  key={peer.id}
                  className="relative bg-black rounded-md overflow-hidden flex items-center justify-center"
                >
                  <video
                    id="remoteStream"
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* fallback avatar */}
                  <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none">
                    <CallerUserSVG className="w-16 h-16 opacity-70" />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center text-black w-full h-full">
                <CallerUserSVG className="w-32 h-32" />
              </div>
            )}
          </div>

          <div className="relative bg-black rounded-md overflow-hidden flex items-center justify-center">
            <video
              id="remoteStream"
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="hidden absolute inset-0 flex items-center justify-center text-white pointer-events-none">
              <CallerUserSVG className="w-16 h-16 opacity-70" />
            </div>
          </div>

          {/* local stream floating window */}
          <div
            className="min-w-[120px] w-[40%] sm:w-[30%] md:w-[20%] lg:w-[20%]
      absolute bottom-[2.5%] right-[2.5%] aspect-square bg-black 
      rounded-md overflow-hidden shadow-lg border border-white/20"
          >
            <video
              autoPlay
              playsInline
              muted
              id="localStream"
              className="w-full h-full object-cover"
            />
            {!localStream && (
              <div className="absolute inset-0 flex items-center justify-center text-green-200 pointer-events-none">
                <CallerUserSVG className="w-20 h-20" />
              </div>
            )}
          </div>
        </div>

        {/* controls */}
        <Card className="mb-10 text-white bg-black items-center">
          <CardContent className="p-2 ">
            <ToggleGroup type="multiple" className="gap-x-4">
              <ToggleGroupItem
                value="bold"
                aria-label="Toggle bold"
                onClick={() => {
                  if (micOn) {
                    pauseAudio();
                    setMicOn(false);
                  } else {
                    resumeAudio();
                    setMicOn(true);
                  }
                }}
              >
                {micOn ? (
                  <MicrophoneSVG className="h-8 w-8" />
                ) : (
                  <MicrophoneOffSVG className="h-8 w-8 text-red-400" />
                )}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="italic"
                aria-label="Toggle italic"
                onClick={() => {
                  if (videoOn) {
                    pauseVideo();
                    setVideoOn(false);
                  } else {
                    resumeVideo();
                    setVideoOn(true);
                  }
                }}
              >
                {videoOn ? (
                  <VideoSVG className="h-8 w-8" />
                ) : (
                  <VideoOffSVG className="h-8 w-8 text-red-400" />
                )}
              </ToggleGroupItem>
              <ToggleGroupItem
                value="underline"
                aria-label="Toggle underline"
                onClick={() => {
                  endCallFunction();
                }}
              >
                <EndCallSVG className="h-8 w-8" />
              </ToggleGroupItem>
            </ToggleGroup>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
