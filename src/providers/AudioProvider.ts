import { create } from "zustand";
import { MutableRefObject } from "react";

interface AudioStore {
  AudioRef: MutableRefObject<HTMLAudioElement | null> | null;
  AudioContext: MutableRefObject<AudioContext | undefined> | null;
  AudioAnalyser: MutableRefObject<AnalyserNode | undefined> | null;
  AudioSource: MutableRefObject<MediaElementAudioSourceNode | undefined> | null;
  AudioFile: string | null;
  AudioFilename: string | null;
  AudioCurrentTime: number | null;
  AudioMaxDuration: number | null;
  AudioSeekTime: number | null;
  AudioPlayState: boolean | null;
  setAudioRef: (
    AudioRef: MutableRefObject<HTMLAudioElement | null> | null
  ) => void;
  setAudioContext: (
    AudioContext: MutableRefObject<AudioContext | undefined> | null
  ) => void;
  setAudioAnalyser: (
    AudioAnalyser: MutableRefObject<AnalyserNode | undefined> | null
  ) => void;
  setAudioSource: (
    AudioSource: MutableRefObject<
      MediaElementAudioSourceNode | undefined
    > | null
  ) => void;
  setAudioFile: (AudioFile: string | null) => void;
  setAudioFilename: (AudioFilename: string | null) => void;
  setAudioCurrentTime: (AudioCurrentTime: number | null) => void;
  setAudioMaxDuration: (AudioMaxDuration: number | null) => void;
  setAudioSeekTime: (AudioSeekTime: number | null) => void;
  setAudioPlayState: (AudioPlayState: boolean | null) => void;
}

export const useAudioStore = create<AudioStore>()((set) => ({
  AudioRef: null,
  AudioContext: null,
  AudioAnalyser: null,
  AudioSource: null,
  AudioFile: null,
  AudioFilename: null,
  AudioCurrentTime: null,
  AudioMaxDuration: null,
  AudioSeekTime: null,
  AudioPlayState: null,
  setAudioRef: (AudioRef: MutableRefObject<HTMLAudioElement | null> | null) =>
    set({ AudioRef }),
  setAudioContext: (
    AudioContext: MutableRefObject<AudioContext | undefined> | null
  ) => set({ AudioContext }),
  setAudioAnalyser: (
    AudioAnalyser: MutableRefObject<AnalyserNode | undefined> | null
  ) => set({ AudioAnalyser }),
  setAudioSource: (
    AudioSource: MutableRefObject<
      MediaElementAudioSourceNode | undefined
    > | null
  ) => set({ AudioSource }),
  setAudioFile: (AudioFile: string | null) => set({ AudioFile }),
  setAudioFilename: (AudioFilename: string | null) => set({ AudioFilename }),
  setAudioCurrentTime: (AudioCurrentTime: number | null) =>
    set({ AudioCurrentTime }),
  setAudioMaxDuration: (AudioMaxDuration: number | null) =>
    set({ AudioMaxDuration }),
  setAudioSeekTime: (AudioSeekTime: number | null) => set({ AudioSeekTime }),
  setAudioPlayState: (AudioPlayState: boolean | null) =>
    set({ AudioPlayState }),
}));
