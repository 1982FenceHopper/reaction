"use client";

import { createSupabaseBrowserClient } from "@/utils/supabase/client";

import { useAudioStore } from "@/providers/AudioProvider";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

import { ListMusic, FileMusic, RefreshCw, Upload, Trash } from "lucide-react";

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
import React, { useRef, useState } from "react";

export default function Library() {
  const { AudioRef, setAudioPlayState, setAudioFile, setAudioFilename } =
    useAudioStore();

  const { toast } = useToast();

  const [files, setFiles] = useState<Array<any>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);

  async function setupLibrary() {
    setLoading(loading ? loading : true);
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      await fetch("/api/fetchUserLibraryState", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: data.user.id,
        }),
      }).then((res) => {
        const response = res.json();
        response.then((data) => {
          if (data.data.length == 0) {
            setLoading(false);
          } else {
            setFiles(JSON.parse(data.data[0].library));
            setLoading(false);
          }
        });
      });
    }
  }

  async function retrieveFiles() {
    setLoading(loading ? loading : true);
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      const uid = data.user.id;
      const email = data.user.email;

      await fetch("/api/fetchAudioFiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
        }),
      }).then((res) => {
        const response = res.json();
        response.then(async (data) => {
          setFiles(data.data);
          setLoading(false);
          toast({
            title: "Library Updated",
            description: `${data.data.length} files retrieved.`,
            className: "bg-[#0a0a0a]/[0.5]",
          });

          await fetch("/api/updateUserLibraryState", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userid: uid,
              email: email,
              library: JSON.stringify(data.data),
            }),
          });
        });
      });
    }
  }

  async function requestFileLink(filename: string) {
    setLoading(loading ? loading : true);
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      await fetch("/api/fetchRequestedFileLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: data.user.id,
          reqfilename: filename,
        }),
      }).then((res) => {
        const response = res.json();
        response.then((data) => {
          fetch(data.data.publicUrl).then((res) => {
            const response = res.blob();
            response.then((data) => {
              const url = URL.createObjectURL(data);
              if (!AudioRef?.current?.paused) {
                setAudioPlayState(false);
                setAudioFile(url);
                setAudioFilename(
                  filename.substring(0, filename.indexOf(".mp3"))
                );
                setAudioPlayState(true);
                toast({
                  title: "Now Playing",
                  description: `${filename.substring(
                    0,
                    filename.indexOf(".mp3")
                  )}`,
                  className: "bg-[#0a0a0a]/[0.5]",
                });
                setLoading(false);
              } else {
                setAudioFile(url);
                setAudioFilename(
                  filename.substring(0, filename.indexOf(".mp3"))
                );
                setAudioPlayState(true);
                toast({
                  title: "Now Playing",
                  description: `${filename.substring(
                    0,
                    filename.indexOf(".mp3")
                  )}`,
                  className: "bg-[#0a0a0a]/[0.5]",
                });
                setLoading(false);
              }
            });
          });
        });
      });
    }
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      setLoading(loading ? loading : true);
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);

      const supabaseClient = createSupabaseBrowserClient();

      const { data, error } = await supabaseClient.auth.getUser();

      if (error) {
        console.log(error);
      } else {
        formData.append("uid", data.user.id);
        await fetch("/api/uploadAudioFile", {
          method: "POST",
          body: formData,
        }).then((res) => {
          const response = res.json();
          response.then((data) => {
            if (data.error) {
              toast({
                title: "Error Uploading File",
                description: "File Already Exists",
                variant: "destructive",
              });
              setLoading(false);
            } else {
              toast({
                title: `File "${file.name}" Uploaded Successfully`,
                description: "Reloading Library...",
                className: "bg-[#0a0a0a]/[0.5]",
              });
              setLoading(false);
              retrieveFiles();
            }
          });
        });
      }
    }
  }

  async function requestFileDeletion(filename: string) {
    setLoading(loading ? loading : true);
    const supabaseClient = createSupabaseBrowserClient();

    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log(error);
    } else {
      const uid = data.user.id;

      await fetch("/api/deleteAudioFile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userid: uid,
          filename: filename,
        }),
      }).then((res) => {
        const response = res.json();
        response.then((data) => {
          toast({
            title: `File ${filename} Deleted Successfully`,
            description: "Reloading Library...",
            className: "bg-[#0a0a0a]/[0.5]",
          });
          setLoading(false);
          retrieveFiles();
        });
      });
    }
  }

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant={"ghost"} size={"icon"} onClick={setupLibrary}>
            <ListMusic strokeWidth={1.5} />
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mx-auto w-full h-full p-4">
            <div className="flex">
              <DrawerHeader>
                <DrawerTitle>Library</DrawerTitle>
                <DrawerDescription>Select An Audio File Here</DrawerDescription>
              </DrawerHeader>
            </div>
            <div className="grid w-full h-full pl-4 pr-4">
              <div className="flex w-full h-full">
                <Button
                  onClick={retrieveFiles}
                  className="w-full mr-2"
                  noJustify={true}
                  disabled={loading ? true : false}
                >
                  <RefreshCw
                    strokeWidth={1.5}
                    className={`mr-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Reload
                </Button>
                <form
                  className="w-full"
                  encType="multipart/form-data"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <input
                    type="file"
                    className="hidden"
                    ref={inputRef}
                    onChange={handleFileUpload}
                  />
                  <Button
                    className="w-full"
                    noJustify={true}
                    onClick={() => {
                      inputRef.current?.click();
                    }}
                    disabled={loading ? true : false}
                  >
                    <Upload strokeWidth={1.5} className="mr-4" />
                    Upload
                  </Button>
                </form>
              </div>
              <div className="w-full border-b-2 mt-6 border-[#313131] rounded-full"></div>
              <ScrollArea className="mt-6 mb-2 h-48 w-full">
                {files === undefined ? (
                  <div>No Files Found</div>
                ) : (
                  files.map((file, key) => {
                    const filename = file["name"].substring(
                      0,
                      file["name"].indexOf(".mp3")
                    );

                    return (
                      <div key={key} className="flex">
                        <Button
                          key={key}
                          variant={"outline"}
                          className="w-full mb-2"
                          noJustify={true}
                          onClick={() => {
                            requestFileLink(file["name"]);
                            setOpen(false);
                          }}
                        >
                          <FileMusic strokeWidth={1.5} className="mr-4" />
                          {filename}
                        </Button>
                        <Button
                          variant={"outline"}
                          className="ml-2 mr-4"
                          size={"icon"}
                          onClick={() => {
                            requestFileDeletion(file["name"]);
                          }}
                        >
                          <Trash strokeWidth={1.5} />
                        </Button>
                      </div>
                    );
                  })
                )}
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
