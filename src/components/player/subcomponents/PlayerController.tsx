"use client";

import { useEffect } from "react";
import { useAudioStore } from "@/providers/AudioProvider";
import { useVisualizationReactiveStore } from "@/providers/VisualizationReactiveProvider";

import { Button } from "@/components/ui/button";
import { Slider_NoThumb } from "@/components/ui/slider-empty-thumb";
import * as SliderPrimitive from "@radix-ui/react-slider";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Pause } from "lucide-react";

type AudioReactivityStyle = {
  "--dynamic-scale": string;
  "--dynamic-color": string;
} & React.CSSProperties;

export function formatTime(seconds: any) {
  let minutes: any = Math.floor(seconds / 60);
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  seconds = Math.floor(seconds % 60);
  seconds = seconds >= 10 ? seconds : "0" + seconds;
  return minutes + ":" + seconds;
}

export default function PlayerController() {
  const {
    AudioFile,
    AudioCurrentTime,
    AudioMaxDuration,
    AudioPlayState,
    setAudioPlayState,
    setAudioSeekTime,
  } = useAudioStore();

  const { PlayerControllerScale, PlayerControllerColor } =
    useVisualizationReactiveStore();

  return (
    <div
      style={
        {
          "--dynamic-scale": `${PlayerControllerScale}%`,
          "--dynamic-color": PlayerControllerColor,
        } as AudioReactivityStyle
      }
      className="flex w-[1000px] h-[80px] bg-[var(--dynamic-color)] justify-center items-center text-center justify-items-center rounded-[12px] transition-all duration-150 ease-in-out scale-[var(--dynamic-scale)]"
    >
      {AudioFile !== null ? (
        <div className="flex w-full h-full justify-center items-center text-center justify-items-center rounded-[12px]">
          <div className="mr-3">
            <Button
              variant={"ghost"}
              size={"icon"}
              onClick={() => {
                setAudioPlayState(!AudioPlayState);
              }}
              className="transition-all duration-150 ease-in-out scale-100 hover:scale-110"
            >
              {AudioPlayState ? (
                <Pause strokeWidth={1.5} />
              ) : (
                <Play strokeWidth={1.5} />
              )}
            </Button>
          </div>
          <div className="min-w-[500px]">
            <Slider_NoThumb
              defaultValue={[0]}
              step={1}
              max={AudioMaxDuration!}
              value={[AudioCurrentTime!]}
              onValueChange={(value) => {
                if (!Number.isNaN(value[0])) {
                  setAudioSeekTime(value[0]);
                }
              }}
              className="w-100%"
            >
              <TooltipProvider delayDuration={0} skipDelayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-neutral-900 bg-white ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-50 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#111111]/[0.6]">
                    <div>
                      {formatTime(Math.round(AudioCurrentTime!)) +
                        " • " +
                        formatTime(Math.round(AudioMaxDuration!))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Slider_NoThumb>
          </div>
        </div>
      ) : (
        <div>No Audio File Selected</div>
      )}
    </div>
  );
}
