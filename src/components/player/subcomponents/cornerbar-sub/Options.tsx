"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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

import { CircleEllipsis, LogOut, Router } from "lucide-react";
import { redirect } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function Options() {
  const { toast } = useToast();
  const router = useRouter();

  async function handleLogout() {
    const supabaseClient = createSupabaseBrowserClient();

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.log(error);
      toast({
        title: "Error Logging Out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      router.push("/");
      router.refresh();
      toast({
        title: "Logged Out Successfully",
        description: "Redirected back to home page.",
        className: "bg-[#0a0a0a]/[0.5]",
      });
    }
  }

  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <CircleEllipsis strokeWidth={1.5} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full h-full p-4">
            <div className="flex">
              <DrawerHeader>
                <DrawerTitle>Options</DrawerTitle>
                <DrawerDescription>Select An Action</DrawerDescription>
              </DrawerHeader>
            </div>
            <div className="grid w-full h-full pl-4 pr-4">
              <div className="w-full border-b-2 border-[#313131] rounded-full mb-6"></div>
              <ScrollArea className="mb-2 h-48 w-full">
                <Button
                  className="w-full mb-2"
                  noJustify={true}
                  onClick={handleLogout}
                >
                  <LogOut strokeWidth={1.5} className="mr-4" />
                  Log Out
                </Button>
              </ScrollArea>
            </div>
          </div>
          <DrawerFooter>
            <div className="pl-4 pr-4 text-[#ffffff50] text-[0.85rem]">
              <div className="w-full border-b-2 border-[#313131] rounded-full mb-4"></div>
              <div>Reaction Player Version: 2.5.0</div>
              <div>Audio Analysation Engine Version: 1.4.0</div>
              <div>
                All App Rights Reserved, And All Audio Rights Belong To Their
                Respective Authors.
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
