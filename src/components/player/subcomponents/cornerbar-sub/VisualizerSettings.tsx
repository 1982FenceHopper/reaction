"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useVisualizationSettingStore } from "@/providers/VisualizationSettingProvider";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioLines } from "lucide-react";

export default function VisualizerSettings() {
  const router = useRouter();
  const { toast } = useToast();

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
  } = useVisualizationSettingStore();

  const [open, setOpen] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);

  const SettingsSchema = z.object({
    fftSize: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .step(32, {
        message: "FFT Window Size must be a multiple of 32/power of 2.",
      })
      .min(32, {
        message:
          "FFT Window Size is too low for any audio calculations, set it greater than 32.",
      })
      .max(32768, {
        message:
          "FFT Window Size is too high and may cause severe performance issues, set it less than 32768.",
      })
      .default(FFTSize!),
    smoothingTimeConstant: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0)
      .max(1)
      .default(smoothingTimeConstant!),
    minDecibels: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(-70)
      .max(maxDecibels!, {
        message:
          "Minimum Decibels cannot be higher than the Maximum Decibels set.",
      })
      .default(minDecibels!),
    maxDecibels: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(minDecibels!, {
        message:
          "Maximum Decibels cannot be lower than the Minimum Decibels set.",
      })
      .max(0)
      .default(maxDecibels!),
    smoothFactor: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0)
      .max(1)
      .default(smoothFactor!),
    reactionFrequencyMinIndex: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0)
      .max(reactionFrequencyMaxIndex!, {
        message:
          "Reaction Minimum Frequency Index cannot be higher than the Reaction Maximum Frequency Index set.",
      })
      .default(reactionFrequencyMinIndex!),
    reactionFrequencyMaxIndex: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(reactionFrequencyMinIndex!, {
        message:
          "Reaction Maximum Frequency Index cannot be lower than the Reaction Minimum Frequency Index set.",
      })
      .max(10000)
      .default(reactionFrequencyMaxIndex!),
    reactionAverageCapLimit: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(reactionThreshold!, {
        message:
          "Reaction Average Cap Limit cannot be lower than the Reaction Threshold set as that would result in the threshold never being met.",
      })
      .max(250)
      .default(reactionAverageCapLimit!),
    reactionThreshold: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0)
      .max(reactionAverageCapLimit!, {
        message:
          "Reaction Threshold cannot be higher than the Reaction Average Cap Limit set as that would result in the threshold never being met.",
      })
      .default(reactionThreshold!),
    showVisualizerBar: z.coerce.boolean().default(showVisualizerBar!),
    visualizerBarCount: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .step(32, { message: "Bar count must be set to a multiple of 32." })
      .min(128, {
        message:
          "Visualizer may fail to render properly if this value is too low.",
      })
      .max(512, {
        message:
          "Exceeding this limit may result in a crash due to browser constraints.",
      })
      .default(visualizerBarCount!),
    visualizerBarWidth: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0.1)
      .max(10)
      .default(visualizerBarWidth!),
    visualizerSmoothFactor: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(0)
      .max(1)
      .default(visualizerSmoothFactor!),
    visualizerMaxBarHeight: z.coerce
      .number({ required_error: "Field cannot be empty." })
      .min(50)
      .max(500)
      .default(visualizerMaxBarHeight!),
    mirrorVisualizerHorizontally: z.coerce
      .boolean()
      .default(mirrorVisualizerHorizontally!),
    useLogarithmicScale: z.coerce.boolean().default(useLogarithmicScale!),
  });

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    values: {
      fftSize: FFTSize! || 0,
      smoothingTimeConstant: smoothingTimeConstant! || 0,
      maxDecibels: maxDecibels! || 0,
      minDecibels: minDecibels! || 0,
      smoothFactor: smoothFactor! || 0,
      reactionFrequencyMinIndex: reactionFrequencyMinIndex! || 0,
      reactionFrequencyMaxIndex: reactionFrequencyMaxIndex! || 0,
      reactionAverageCapLimit: reactionAverageCapLimit! || 0,
      reactionThreshold: reactionThreshold! || 0,
      showVisualizerBar: showVisualizerBar! || false,
      visualizerBarCount: visualizerBarCount! || 0,
      visualizerBarWidth: visualizerBarWidth! || 0,
      visualizerSmoothFactor: visualizerSmoothFactor! || 0,
      visualizerMaxBarHeight: visualizerMaxBarHeight! || 0,
      mirrorVisualizerHorizontally: mirrorVisualizerHorizontally! || false,
      useLogarithmicScale: useLogarithmicScale! || false,
    },
  });

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
          console.log("Successfully Updated User Settings: ", data.data);
        });
      });
    }
  }

  async function onSubmit(data: z.infer<typeof SettingsSchema>) {
    const validation = await SettingsSchema.spa(data);

    if (validation.success == true) {
      setOpen(false);

      await updateVisualizerState(
        JSON.stringify({
          FFTSize: data.fftSize,
          smoothingTimeConstant: data.smoothingTimeConstant,
          maxDecibels: data.maxDecibels,
          minDecibels: data.minDecibels,
          smoothFactor: data.smoothFactor,
          reactionFrequencyMinIndex: data.reactionFrequencyMinIndex,
          reactionFrequencyMaxIndex: data.reactionFrequencyMaxIndex,
          reactionAverageCapLimit: data.reactionAverageCapLimit,
          reactionThreshold: data.reactionThreshold,
          showVisualizerBar: data.showVisualizerBar,
          visualizerBarCount: data.visualizerBarCount,
          visualizerBarWidth: data.visualizerBarWidth,
          visualizerSmoothFactor: data.visualizerSmoothFactor,
          visualizerMaxBarHeight: data.visualizerMaxBarHeight,
          mirrorVisualizerHorizontally: data.mirrorVisualizerHorizontally,
          useLogarithmicScale: data.useLogarithmicScale,
        })
      );

      sessionStorage.setItem("reloaded", "true");
      sessionStorage.setItem("settings", JSON.stringify(data, null, 2));
      window.location.reload();
    } else {
      return;
    }
  }

  // * START RELOAD HANDLER: Handle Toast On Reload, Do not add irrelevant logging code.
  useEffect(() => {
    if (sessionStorage.getItem("reloaded") === "true") {
      const timeout = setTimeout(() => {
        toast({
          title: "Settings Updated.",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {sessionStorage.getItem("settings")}
              </code>
            </pre>
          ),
        });

        sessionStorage.removeItem("reloaded");
        sessionStorage.removeItem("settings");
      }, 0);

      return () => clearTimeout(timeout);
    }
  }, [toast]);
  // * END RELOAD HANDLER: Add all stuff needed into a separate useEffect hook.

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <AudioLines strokeWidth={1.5} />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full">
          <div className="mx-auto w-full h-full p-4">
            <div className="flex">
              <DrawerHeader>
                <DrawerTitle>Visualizer Settings</DrawerTitle>
                <DrawerDescription>
                  Change How The Visualizer Reacts
                </DrawerDescription>
              </DrawerHeader>
            </div>
            <div className="grid w-full h-full pl-4 pr-4">
              <div className="w-full border-b-2 border-[#313131] rounded-full mb-6"></div>
              <ScrollArea className="mb-2 h-96 w-full">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full space-y-6"
                    id="visualizerSettingsForm"
                  >
                    <div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="fftSize"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  FFT Window Size
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the window size for processing
                                  frequency information from the currently
                                  playing audio for visualizations. Setting it
                                  above 8192 is not recommended for performance
                                  reasons.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${FFTSize}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="smoothingTimeConstant"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Audio Smoothing Time Constant
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the overall smoothing applied over time
                                  for the audio analysation (i.e. how smooth
                                  should the overall visualizer should look).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${smoothingTimeConstant}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="minDecibels"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Minimum Analysation Decibels
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the minimum decibels that should cap
                                  the bottom of the analysation values for
                                  reactiveness.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${minDecibels}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="maxDecibels"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0 5">
                                <FormLabel className="text-base">
                                  Maximum Analysation Decibels
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the maximum decibels that should cap
                                  the top of the analysation values for
                                  reactiveness.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${maxDecibels}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="smoothFactor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualization Smoothing Factor
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the smoothing applied to the
                                  visualizations themselves, can be thought of
                                  as an additional fine-tuning variable of the
                                  Smoothing Time Constant.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${smoothFactor}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reactionFrequencyMinIndex"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Bass Frequency Minimum Index
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the minimum frequency bin for the
                                  background visualization/beat detection.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${reactionFrequencyMinIndex}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reactionFrequencyMaxIndex"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Bass Frequency Maximum Index
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust the maximum frequency bin for the
                                  background visualization/beat detection.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${reactionFrequencyMaxIndex}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reactionAverageCapLimit"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Bass Detection Limit
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Limit the average value of the bass frequency
                                  bins to allow thresholding to occur more
                                  precisely (Controlled by the Minimum and
                                  Maximum Indexes).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${reactionAverageCapLimit}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reactionThreshold"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Bass Threshold
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Controls at what point and above in the
                                  frequency bin averages should be considered a
                                  beat/kick in the audio.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${reactionThreshold}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="showVisualizerBar"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Show Bar Visualizer
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Set whether the blurred bar visualizer should
                                  show (may cause performance issues on weaker
                                  systems).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    if (checked == showVisualizerBar) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }

                                    field.onChange(!field.value);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="visualizerBarCount"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualizer Bar Count
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust how many bars is displayed in the bar
                                  visualizer (Use in conjunction with bar width
                                  to avoid graphical glitches).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${visualizerBarCount}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="visualizerBarWidth"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualizer Bar Width
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust how wide each bar in the visualizer
                                  should be (Use in conjunction with bar count
                                  to avoid graphical glitches).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${visualizerBarWidth}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="visualizerSmoothFactor"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualizer Smooth Factor
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Adjust how smooth the bar visualizer should
                                  react (Takes into account the normal smooth
                                  factor and the smoothing time constant, use
                                  this as a finer-tuning adjustment).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${visualizerSmoothFactor}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="visualizerMaxBarHeight"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualizer Max Bar Height
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Control how high the bars in the visualizer
                                  will react (is heavily affected by the
                                  analysation minimum and maximum decibels).
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder={`${visualizerMaxBarHeight}`}
                                  onChangeCapture={(e) => {
                                    const target = e.target as HTMLInputElement;

                                    if (target.value == target.placeholder) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }
                                  }}
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="mirrorVisualizerHorizontally"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Mirror Visualizer Horizontally
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Set whether the bar visualizer will mirror on
                                  both sides.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    if (
                                      checked == mirrorVisualizerHorizontally
                                    ) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }

                                    field.onChange(!field.value);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="useLogarithmicScale"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#1c1c1c] p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Visualizer Logarithmic Scale
                                </FormLabel>
                                <FormDescription className="break-words">
                                  Set whether the bar visualizer uses Linear
                                  Scale (default) or Logarithmic Scale to
                                  display bars.
                                </FormDescription>
                                <FormMessage />
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    if (checked == useLogarithmicScale) {
                                      setChanged(false);
                                    } else {
                                      setChanged(true);
                                    }

                                    field.onChange(!field.value);
                                  }}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </form>
                </Form>
              </ScrollArea>
              <div className="flex min-w-full mt-6 justify-center items-center justify-items-center">
                <Button
                  type="submit"
                  form="visualizerSettingsForm"
                  className="w-1/4 mr-6"
                  disabled={!changed}
                >
                  Save
                </Button>
                <Button
                  variant={"outline"}
                  className="w-1/4"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
