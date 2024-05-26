"use client";

import { useAudioStore } from "./AudioProvider";
import { useVisualizationReactiveStore } from "./VisualizationReactiveProvider";
import { useVisualizationSettingStore } from "./VisualizationSettingProvider";

import {
  NumberRangeLimit,
  FrequencyAverage,
  FrequencyThreshold,
  HasHitFrequencyThreshold,
  easeInOutSine,
  smoothInterpolation,
  logarithmicReturn,
} from "@/utils/visualization/VisualizationHelper";

import { useRef, useEffect, ReactNode } from "react";

export default function VisualizationDataProvider({
  children,
}: Readonly<{ children: ReactNode }>) {
  const { AudioRef, AudioAnalyser } = useAudioStore();
  const {
    FFTSize,
    smoothingTimeConstant,
    minDecibels,
    maxDecibels,
    smoothFactor,
    reactionFrequencyMinIndex,
    reactionFrequencyMaxIndex,
    reactionAverageCapLimit,
    reactionThreshold,
    showVisualizerBar,
    visualizerBarCount,
    visualizerBarWidth,
    visualizerSmoothFactor,
    visualizerMaxBarHeight,
    mirrorVisualizerHorizontally,
    useLogarithmicScale,
  } = useVisualizationSettingStore();
  const {
    VisualizerCanvas,
    VisualizerCanvasContext,
    setBackgroundGrayscale,
    setPlayerControllerScale,
    setPlayerControllerColor,
  } = useVisualizationReactiveStore();

  const audioData = useRef<Uint8Array>();
  const smoothedAudioData = useRef<Uint8Array>();
  const visualizerSubsetAudioData = useRef<Uint8Array>();
  const visualizerLogarithmicSubsetAudioData = useRef<Uint8Array>();
  const audioTimeDomainData = useRef<Uint8Array>();

  useEffect(() => {
    if (AudioAnalyser?.current) {
      AudioAnalyser.current.fftSize = FFTSize!;
      AudioAnalyser.current.smoothingTimeConstant = smoothingTimeConstant!;
      AudioAnalyser.current.maxDecibels = maxDecibels!;
      AudioAnalyser.current.minDecibels = minDecibels!;

      audioData.current = new Uint8Array(
        AudioAnalyser.current.frequencyBinCount
      );
      smoothedAudioData.current = new Uint8Array(
        AudioAnalyser.current.frequencyBinCount
      );
      audioTimeDomainData.current = new Uint8Array(
        AudioAnalyser.current.frequencyBinCount
      );

      AudioDataSetup();
    }

    function AudioDataSetup() {
      const animationID = requestAnimationFrame(AudioDataSetup);

      if (AudioRef?.current!.paused) {
        cancelAnimationFrame(animationID);
      }

      if (!AudioRef?.current!.paused) {
        AudioAnalyser!.current?.getByteFrequencyData(audioData.current!);
        AudioAnalyser!.current?.getByteTimeDomainData(
          audioTimeDomainData.current!
        );

        for (let i = 0; i < audioData.current!.length; i++) {
          smoothedAudioData.current![i] =
            (1 - smoothFactor!) * smoothedAudioData.current![i] +
            smoothFactor! * audioData.current![i];
        }
      }

      const dynamicBarCount = mirrorVisualizerHorizontally
        ? visualizerBarCount! / 2
        : visualizerBarCount;

      visualizerSubsetAudioData.current = smoothedAudioData.current?.slice(
        0,
        dynamicBarCount
      );

      if (smoothedAudioData.current) {
        const hasHitThreshold = HasHitFrequencyThreshold(
          NumberRangeLimit(
            FrequencyAverage(
              smoothedAudioData.current!,
              reactionFrequencyMinIndex!,
              reactionFrequencyMaxIndex!
            ),
            0,
            reactionAverageCapLimit!
          ),
          reactionThreshold!
        );

        AffectSingularElements(hasHitThreshold);

        if (visualizerSubsetAudioData.current) {
          visualizerLogarithmicSubsetAudioData.current = smoothInterpolation(
            logarithmicReturn(visualizerSubsetAudioData.current),
            easeInOutSine
          );

          if (showVisualizerBar) {
            AffectVisualizerCanvas();
          }
        }
      }
    }

    function AffectSingularElements(threshold: boolean) {
      setBackgroundGrayscale(threshold ? 0 : 100);
      setPlayerControllerScale(threshold ? 101 : 100);
      setPlayerControllerColor(threshold ? "#AAAAAA99" : "#11111199");
    }

    function AffectVisualizerCanvas() {
      if (VisualizerCanvasContext?.current) {
        const cctx = VisualizerCanvasContext.current;
        const cwidth = VisualizerCanvas?.current?.width;
        const cheight = VisualizerCanvas?.current?.height;

        cctx.clearRect(0, 0, cwidth!, cheight!);

        cctx.strokeStyle = "white";
        cctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        cctx.shadowBlur = 5;

        const widthlevel = (cwidth! / cwidth!) * 1.5;

        (useLogarithmicScale!
          ? visualizerLogarithmicSubsetAudioData.current!
          : visualizerSubsetAudioData.current!
        ).forEach((value, index) => {
          let barHeight = (value / 255) * visualizerMaxBarHeight!;
          let barTop = cheight! - barHeight;

          cctx.beginPath();
          cctx.roundRect(
            index * (visualizerBarWidth! * widthlevel),
            barTop,
            visualizerBarWidth!,
            barHeight,
            25
          );
          cctx.fill();
        });

        if (mirrorVisualizerHorizontally!) {
          (useLogarithmicScale!
            ? visualizerLogarithmicSubsetAudioData.current!
            : visualizerSubsetAudioData.current!
          ).forEach((value, index) => {
            let barHeight = (value / 255) * visualizerMaxBarHeight!;
            let barTop = cheight! - barHeight;

            cctx.beginPath();
            cctx.roundRect(
              cwidth! - index * (visualizerBarWidth! * widthlevel),
              barTop,
              visualizerBarWidth!,
              barHeight,
              25
            );
            cctx.fill();
          });
        }
      }
    }

    if (audioData.current) {
      console.log("REACTION APP: Audio Processing Has Started.");
    }
  }, [
    AudioAnalyser,
    AudioRef,
    FFTSize,
    smoothingTimeConstant,
    minDecibels,
    maxDecibels,
    smoothFactor,
    setBackgroundGrayscale,
    setPlayerControllerScale,
    setPlayerControllerColor,
    reactionFrequencyMinIndex,
    reactionFrequencyMaxIndex,
    reactionAverageCapLimit,
    reactionThreshold,
    VisualizerCanvas,
    VisualizerCanvasContext,
    mirrorVisualizerHorizontally,
    useLogarithmicScale,
    visualizerBarCount,
    visualizerBarWidth,
    visualizerSmoothFactor,
    visualizerMaxBarHeight,
    showVisualizerBar,
  ]);

  return <div>{children}</div>;
}
