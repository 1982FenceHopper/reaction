import { create } from "zustand";

interface VisualizationSettingStore {
  FFTSize: number | undefined;
  smoothingTimeConstant: number | undefined;
  maxDecibels: number | undefined;
  minDecibels: number | undefined;
  smoothFactor: number | undefined;
  reactionFrequencyMinIndex: number | undefined;
  reactionFrequencyMaxIndex: number | undefined;
  reactionAverageCapLimit: number | undefined;
  reactionThreshold: number | undefined;
  showVisualizerBar: boolean | undefined;
  visualizerBarCount: number | undefined;
  visualizerBarWidth: number | undefined;
  visualizerSmoothFactor: number | undefined;
  visualizerMaxBarHeight: number | undefined;
  mirrorVisualizerHorizontally: boolean | undefined;
  useLogarithmicScale: boolean | undefined;
  setFFTSize: (FFTSize: number | undefined) => void;
  setSmoothingTimeConstant: (smoothingTimeConstant: number | undefined) => void;
  setMaxDecibels: (maxDecibels: number | undefined) => void;
  setMinDecibels: (minDecibels: number | undefined) => void;
  setSmoothFactor: (smoothFactor: number | undefined) => void;
  setReactionFrequencyMinIndex: (
    reactionFrequencyMinIndex: number | undefined
  ) => void;
  setReactionFrequencyMaxIndex: (
    reactionFrequencyMaxIndex: number | undefined
  ) => void;
  setReactionAverageCapLimit: (
    reactionAverageCapLimit: number | undefined
  ) => void;
  setReactionThreshold: (reactionThreshold: number | undefined) => void;
  setShowVisualizerBar: (showVisualizerBar: boolean | undefined) => void;
  setVisualizerBarCount: (visualizerBarCount: number | undefined) => void;
  setVisualizerBarWidth: (visualizerBarWidth: number | undefined) => void;
  setVisualizerSmoothFactor: (
    visualizerSmoothFactor: number | undefined
  ) => void;
  setVisualizerMaxBarHeight: (
    visualizerMaxBarHeight: number | undefined
  ) => void;
  setMirrorVisualizerHorizontally: (
    mirrorVisualizerHorizontally: boolean | undefined
  ) => void;
  setUseLogarithmicScale: (useLogarithmicScale: boolean | undefined) => void;
}

export const useVisualizationSettingStore = create<VisualizationSettingStore>()(
  (set) => ({
    FFTSize: undefined,
    smoothingTimeConstant: undefined,
    maxDecibels: undefined,
    minDecibels: undefined,
    smoothFactor: undefined,
    reactionFrequencyMinIndex: undefined,
    reactionFrequencyMaxIndex: undefined,
    reactionAverageCapLimit: undefined,
    reactionThreshold: undefined,
    showVisualizerBar: undefined,
    visualizerBarCount: undefined,
    visualizerBarWidth: undefined,
    visualizerSmoothFactor: undefined,
    visualizerMaxBarHeight: undefined,
    mirrorVisualizerHorizontally: undefined,
    useLogarithmicScale: undefined,
    setFFTSize: (FFTSize: number | undefined) => set({ FFTSize }),
    setSmoothingTimeConstant: (smoothingTimeConstant: number | undefined) =>
      set({ smoothingTimeConstant }),
    setMaxDecibels: (maxDecibels: number | undefined) => set({ maxDecibels }),
    setMinDecibels: (minDecibels: number | undefined) => set({ minDecibels }),
    setSmoothFactor: (smoothFactor: number | undefined) =>
      set({ smoothFactor }),
    setReactionFrequencyMinIndex: (
      reactionFrequencyMinIndex: number | undefined
    ) => set({ reactionFrequencyMinIndex }),
    setReactionFrequencyMaxIndex: (
      reactionFrequencyMaxIndex: number | undefined
    ) => set({ reactionFrequencyMaxIndex }),
    setReactionAverageCapLimit: (reactionAverageCapLimit: number | undefined) =>
      set({ reactionAverageCapLimit }),
    setReactionThreshold: (reactionThreshold: number | undefined) =>
      set({ reactionThreshold }),
    setShowVisualizerBar: (showVisualizerBar: boolean | undefined) =>
      set({ showVisualizerBar }),
    setVisualizerBarCount: (visualizerBarCount: number | undefined) =>
      set({ visualizerBarCount }),
    setVisualizerBarWidth: (visualizerBarWidth: number | undefined) =>
      set({ visualizerBarWidth }),
    setVisualizerSmoothFactor: (visualizerSmoothFactor: number | undefined) =>
      set({ visualizerSmoothFactor }),
    setVisualizerMaxBarHeight: (visualizerMaxBarHeight: number | undefined) =>
      set({ visualizerMaxBarHeight }),
    setMirrorVisualizerHorizontally: (
      mirrorVisualizerHorizontally: boolean | undefined
    ) => set({ mirrorVisualizerHorizontally }),
    setUseLogarithmicScale: (useLogarithmicScale: boolean | undefined) =>
      set({ useLogarithmicScale }),
  })
);
