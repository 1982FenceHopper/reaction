import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  const supabaseServer = createSupabaseServerClient(cookieStore);

  const clientRequest = await req.json();
  const clientID = await clientRequest["userid"];
  const clientFilename = await clientRequest["filename"];

  const { data, error } = await supabaseServer.storage
    .from("user_audios")
    .remove([`${clientID}/${clientFilename}`]);

  if (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    console.log(data);
    return NextResponse.json({ data: data }, { status: 200 });
  }
}
