"use client";

import { BackgroundGradientAnimationReactive } from "@/components/ui/background-gradient-animation-reactive";

import { useVisualizationReactiveStore } from "@/providers/VisualizationReactiveProvider";
import React, { useEffect, useRef, useState } from "react";

type DynamicStyles = {
  "--visualizer-glow": string;
} & React.CSSProperties;

export default function Background() {
  const { setVisualizerCanvas, setVisualizerCanvasContext } =
    useVisualizationReactiveStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;

      canvasCtxRef.current = canvasRef.current.getContext("2d", {
        willReadFrequently: true,
      });

      setVisualizerCanvas(canvasRef);
      setVisualizerCanvasContext(canvasCtxRef);
    }
  }, [setVisualizerCanvas, setVisualizerCanvasContext]);

  return (
    <div className="min-w-full min-h-full">
      <svg className="hidden">
        <defs>
          <filter id="blurBar">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur1"
            />
            <feColorMatrix
              in="blur1"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo1"
            />
            <feBlend in="SourceGraphic" in2="goo1" />
          </filter>
        </defs>
      </svg>
      <BackgroundGradientAnimationReactive
        interactive={false}
      ></BackgroundGradientAnimationReactive>
      <div
        className={`absolute top-full left-1/2 translate-x-[-50%] translate-y-[-100%] ${
          isSafari ? "blur-2xl" : "[filter:url(#blurBar)_blur(25px)]"
        }`}
      >
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
