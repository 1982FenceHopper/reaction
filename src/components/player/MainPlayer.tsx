"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import FadeOutComponents from "./FadeOutComponents";
import Background from "./subcomponents/Background";

import { useAudioStore } from "@/providers/AudioProvider";
import { useVisualizationSettingStore } from "@/providers/VisualizationSettingProvider";
import { useVisualizationReactiveStore } from "@/providers/VisualizationReactiveProvider";

import VisualizationDataProvider from "@/providers/VisualizationDataProvider";

import { useRef, useEffect, useState } from "react";

type MouseControlledCustomStyle = {
  "--mouse-dynamic-opacity": string;
} & React.CSSProperties;

type AudioReactivityStyle = {
  "--background-grayscale": string;
} & React.CSSProperties;

export default function Visualizer() {
  const LocalAudioRef = useRef<HTMLAudioElement>(null);
  const LocalAudioContext = useRef<AudioContext>();
  const LocalAudioAnalyser = useRef<AnalyserNode>();
  const LocalAudioSource = useRef<MediaElementAudioSourceNode>();

  const [ComponentOpacity, setComponentOpacity] = useState<number>(100);

  const {
    AudioSeekTime,
    AudioPlayState,
    AudioFile,
    setAudioRef,
    setAudioContext,
    setAudioAnalyser,
    setAudioCurrentTime,
    setAudioMaxDuration,
    setAudioSource,
    setAudioSeekTime,
  } = useAudioStore();

  const {
    FFTSize,
    smoothingTimeConstant,
    maxDecibels,
    minDecibels,
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
    setFFTSize,
    setSmoothingTimeConstant,
    setMaxDecibels,
    setMinDecibels,
    setSmoothFactor,
    setReactionFrequencyMinIndex,
    setReactionFrequencyMaxIndex,
    setReactionAverageCapLimit,
    setReactionThreshold,
    setShowVisualizerBar,
    setVisualizerBarCount,
    setVisualizerBarWidth,
    setVisualizerSmoothFactor,
    setVisualizerMaxBarHeight,
    setMirrorVisualizerHorizontally,
    setUseLogarithmicScale,
  } = useVisualizationSettingStore();

  const { BackgroundGrayscale, setBackgroundGrayscale } =
    useVisualizationReactiveStore();

  useEffect(() => {
    if (LocalAudioRef.current) {
      const AudioElementID = LocalAudioRef.current.id;
      if (AudioElementID) {
        setAudioRef(LocalAudioRef);
      }
    }

    if (LocalAudioRef.current != null) {
      if (AudioPlayState) {
        LocalAudioRef.current!.play();
      } else {
        LocalAudioRef.current!.pause();
      }

      setAudioMaxDuration(LocalAudioRef.current.duration);

      if (AudioSeekTime != null) {
        LocalAudioRef.current.currentTime = AudioSeekTime;
        setAudioSeekTime(null);
      }
    }
  }, [
    setAudioRef,
    AudioPlayState,
    setAudioCurrentTime,
    setAudioMaxDuration,
    setBackgroundGrayscale,
    setAudioSeekTime,
    AudioSeekTime,
    LocalAudioRef?.current?.duration,
  ]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const mouseUpdateOpacity = () => {
      setComponentOpacity(100);

      clearTimeout(timeout);

      timeout = setTimeout(() => {
        setComponentOpacity(0);
      }, 5000);
    };

    window.addEventListener("mousemove", mouseUpdateOpacity);

    return () => {
      window.removeEventListener("mousemove", mouseUpdateOpacity);
    };
  }, []);

  async function updateVisualizerState(settings: string) {
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      const userID = data.user.id;
      const userEmail = data.user.email;

      await fetch("/api/updateUserVisualizerState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userID,
          email: userEmail,
          settings: settings,
        }),
      }).then((res) => {
        const response = res.json();
        response.then((data) => {
          console.log(data);
        });
      });
    }
  }

  async function retrieveVisualizerState() {
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      const userID = data.user.id;

      await fetch("/api/fetchUserVisualizerState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: userID,
        }),
      }).then((res) => {
        const response = res.json();
        response.then((data) => {
          if (data.data.length == 0) {
            updateVisualizerState(
              JSON.stringify({
                FFTSize: 8192,
                smoothingTimeConstant: 0.7,
                maxDecibels: -6,
                minDecibels: -55,
                smoothFactor: 0.8,
                reactionFrequencyMinIndex: 0,
                reactionFrequencyMaxIndex: 100,
                reactionAverageCapLimit: 65,
                reactionThreshold: 40,
                showVisualizerBar: true,
                visualizerBarCount: 256,
                visualizerBarWidth: 5,
                visualizerSmoothFactor: 0.7,
                visualizerMaxBarHeight: 400,
                mirrorVisualizerHorizontally: true,
                useLogarithmicScale: false,
              })
            );

            window.location.reload();
          } else {
            const settings = JSON.parse(data.data[0].settings);
            setFFTSize(settings.FFTSize);
            setSmoothingTimeConstant(settings.smoothingTimeConstant);
            setMaxDecibels(settings.maxDecibels);
            setMinDecibels(settings.minDecibels);
            setSmoothFactor(settings.smoothFactor);
            setReactionFrequencyMinIndex(settings.reactionFrequencyMinIndex);
            setReactionFrequencyMaxIndex(settings.reactionFrequencyMaxIndex);
            setReactionAverageCapLimit(settings.reactionAverageCapLimit);
            setReactionThreshold(settings.reactionThreshold);
            setShowVisualizerBar(settings.showVisualizerBar);
            setVisualizerBarCount(settings.visualizerBarCount);
            setVisualizerBarWidth(settings.visualizerBarWidth);
            setVisualizerSmoothFactor(settings.visualizerSmoothFactor);
            setVisualizerMaxBarHeight(settings.visualizerMaxBarHeight);
            setMirrorVisualizerHorizontally(
              settings.mirrorVisualizerHorizontally
            );
            setUseLogarithmicScale(settings.useLogarithmicScale);
          }
        });
      });
    }
  }

  useEffect(() => {
    retrieveVisualizerState();
  }, []);

  const UpdateSlider = () => {
    if (LocalAudioRef.current) {
      setAudioCurrentTime(LocalAudioRef.current.currentTime);
    }
  };

  const audioAvailable = () => {
    LocalAudioContext.current = new AudioContext();
    if (!LocalAudioSource.current) {
      LocalAudioSource.current =
        LocalAudioContext.current.createMediaElementSource(
          LocalAudioRef.current!
        );

      LocalAudioAnalyser.current = LocalAudioContext.current.createAnalyser();

      LocalAudioSource.current.connect(LocalAudioAnalyser.current);
      LocalAudioAnalyser.current.connect(LocalAudioContext.current.destination);
    }

    setAudioContext(LocalAudioContext);
    setAudioAnalyser(LocalAudioAnalyser);
    setAudioSource(LocalAudioSource);
  };

  return (
    <div className="min-w-screen min-h-screen flex m-0 p-0">
      <audio
        src={AudioFile!}
        ref={LocalAudioRef}
        onTimeUpdate={UpdateSlider}
        onPlay={audioAvailable}
        loop
      />
      <VisualizationDataProvider>
        <div
          style={
            {
              "--background-grayscale": `${BackgroundGrayscale}%`,
            } as AudioReactivityStyle
          }
          className="grayscale-[var(--background-grayscale)] transition-all duration-150 ease-in-out min-w-full min-h-full"
        >
          <Background />
        </div>
      </VisualizationDataProvider>
      <div
        style={
          {
            "--mouse-dynamic-opacity": `${ComponentOpacity}%`,
          } as MouseControlledCustomStyle
        }
        className="transition-opacity duration-100 ease-in-out flex absolute w-full h-full opacity-[var(--mouse-dynamic-opacity)]"
      >
        <FadeOutComponents />
      </div>
    </div>
  );
}
