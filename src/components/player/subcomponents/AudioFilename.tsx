"use client";

import { useAudioStore } from "@/providers/AudioProvider";

export default function AudioFilename() {
  const { AudioFilename } = useAudioStore();

  return <div>{AudioFilename === null ? "" : AudioFilename}</div>;
}
