"use client";

import PlayerController from "./subcomponents/PlayerController";
import CornerBar from "./subcomponents/CornerBar";
import AudioFilename from "./subcomponents/AudioFilename";

export default function FadeOutComponents() {
  return (
    <div className="flex absolute w-full h-full">
      <div className="absolute left-1/2 translate-x-[-50%] top-[2%] translate-y-[-2%] text-[#FFFFFF]/[0.5]">
        <AudioFilename />
      </div>
      <div className="absolute min-w-[50px] min-h-[150px] transition-all duration-150 ease-in-out blur-sm hover:blur-0">
        <CornerBar />
      </div>
      <div className="absolute left-1/2 top-[95%] translate-x-[-50%] translate-y-[-95%]">
        <PlayerController />
      </div>
    </div>
  );
}
