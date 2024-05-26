import { MutableRefObject } from "react";
import { create } from "zustand";

interface VisualizationReactiveStore {
  BackgroundGrayscale: number | undefined;
  PlayerControllerScale: number | undefined;
  PlayerControllerColor: string | undefined;
  VisualizerCanvas: MutableRefObject<HTMLCanvasElement | null> | undefined;
  VisualizerCanvasContext:
    | MutableRefObject<CanvasRenderingContext2D | null>
    | undefined;
  setBackgroundGrayscale: (BackgroundGrayscale: number | undefined) => void;
  setPlayerControllerScale: (PlayerControllerScale: number | undefined) => void;
  setPlayerControllerColor: (PlayerControllerColor: string | undefined) => void;
  setVisualizerCanvas: (
    VisualizerCanvas: MutableRefObject<HTMLCanvasElement | null> | undefined
  ) => void;
  setVisualizerCanvasContext: (
    VisualizerCanvasContext:
      | MutableRefObject<CanvasRenderingContext2D | null>
      | undefined
  ) => void;
}

export const useVisualizationReactiveStore =
  create<VisualizationReactiveStore>()((set) => ({
    BackgroundGrayscale: 100,
    PlayerControllerScale: 100,
    PlayerControllerColor: "#11111199",
    VisualizerCanvas: undefined,
    VisualizerCanvasContext: undefined,
    setBackgroundGrayscale: (BackgroundGrayscale: number | undefined) =>
      set({ BackgroundGrayscale }),
    setPlayerControllerScale: (PlayerControllerScale: number | undefined) =>
      set({ PlayerControllerScale }),
    setPlayerControllerColor: (PlayerControllerColor: string | undefined) =>
      set({ PlayerControllerColor }),
    setVisualizerCanvas: (
      VisualizerCanvas: MutableRefObject<HTMLCanvasElement | null> | undefined
    ) => set({ VisualizerCanvas }),
    setVisualizerCanvasContext: (
      VisualizerCanvasContext:
        | MutableRefObject<CanvasRenderingContext2D | null>
        | undefined
    ) => set({ VisualizerCanvasContext }),
  }));
