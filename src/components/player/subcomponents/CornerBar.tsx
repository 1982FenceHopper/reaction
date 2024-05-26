"use client";

import Library from "./cornerbar-sub/Library";
import VisualizerSettings from "./cornerbar-sub/VisualizerSettings";
import Options from "./cornerbar-sub/Options";

export default function CornerBar() {
  return (
    <div className="grid absolute w-full h-full justify-center justify-items-center align-middle pt-2">
      <div className="w-min h-min m-0 p-0 relative">
        <Library />
      </div>
      <div className="w-min h-min m-0 p-0 relative">
        <VisualizerSettings />
      </div>
      <div className="w-min h-min m-0 p-0 relative">
        <Options />
      </div>
    </div>
  );
}
