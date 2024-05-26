import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  const supabaseServer = createSupabaseServerClient(cookieStore);

  const clientRequest = await req.formData();
  const clientID = await clientRequest.get("uid");
  const clientFile = await clientRequest.get("file");
  const clientFilename = await clientRequest.get("filename");

  const { data, error } = await supabaseServer.storage
    .from("user_audios")
    .upload(`${clientID}/${clientFilename}`, clientFile!, {
      contentType: "audio/mpeg",
    });

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    console.log(data);
    return NextResponse.json({ data: data }, { status: 200 });
  }
}
