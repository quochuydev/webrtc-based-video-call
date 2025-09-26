"use client";

import { setupStream } from "../utils/peerConnection";
import React, { useContext, useState } from "react";

const initialValues: {
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  remoteStreams: MediaStream[];
  setStream: Function;
  closeStream: Function;
  pauseVideo: Function;
  resumeVideo: Function;
  pauseAudio: Function;
  resumeAudio: Function;
  stopMediaStream: Function;
} = {
  localStream: undefined,
  remoteStream: undefined,
  remoteStreams: [],
  setStream: () => {},
  closeStream: () => {},
  pauseVideo: () => {},
  resumeVideo: () => {},
  pauseAudio: () => {},
  resumeAudio: () => {},
  stopMediaStream: () => {},
};

type Props = {
  children?: React.ReactNode;
};

const StreamContext = React.createContext(initialValues);

const useStream = () => useContext(StreamContext);

const StreamProvider: React.FC<Props> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream>();

  const remoteStream = new MediaStream();
  const [remoteStreams] = useState<MediaStream[]>([]);

  const setStream = async () => {
    const localStreamData = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(localStreamData);

    const remoteVideo = document.getElementById(
      "remoteStream"
    ) as HTMLVideoElement;

    await setupStream({ localStreamData, remoteVideo });
  };

  const closeStream = async () => {
    setLocalStream(undefined);
  };

  function pauseVideo() {
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = false;
    }
  }

  function resumeVideo() {
    if (localStream && localStream.getVideoTracks().length > 0) {
      localStream.getVideoTracks()[0].enabled = true;
    }
  }

  function pauseAudio() {
    if (localStream && localStream.getAudioTracks().length > 0) {
      localStream.getAudioTracks()[0].enabled = false;
    }
  }

  function resumeAudio() {
    if (localStream && localStream.getAudioTracks().length > 0) {
      localStream.getAudioTracks()[0].enabled = true;
    }
  }

  const stopMediaStream = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <StreamContext.Provider
      value={{
        localStream,
        remoteStream,
        remoteStreams,
        setStream,
        closeStream,
        pauseVideo,
        resumeVideo,
        pauseAudio,
        resumeAudio,
        stopMediaStream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
};

export { StreamProvider, useStream };
