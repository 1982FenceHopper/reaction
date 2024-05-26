"use client";

import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";

export default function page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="grid min-h-screen min-w-screen overflow-hidden">
      <div className="grayscale">
        <BackgroundGradientAnimation />
      </div>
      <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <p className="text-5xl">Something Went Wrong.</p>
        <p className="text-2xl text-[#FFFFFF]/[0.6] mt-2">ERRORMESSAGE</p>
        <Button className="mt-2">Click here to retry page render.</Button>
      </div>
    </div>
  );
}
