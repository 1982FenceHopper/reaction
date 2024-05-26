import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  const supabaseServer = createSupabaseServerClient(cookieStore);

  const clientRequest = await req.json();
  const clientID = await clientRequest["userid"];
  const clientEmail = await clientRequest["email"];
  const clientLibrary = await clientRequest["library"];

  const { data, error } = await supabaseServer
    .from("userlibrarystate")
    .upsert(
      {
        uid: clientID,
        email: clientEmail,
        library: clientLibrary,
        last_updated: new Date().toISOString().toLocaleString(),
      },
      { onConflict: "uid" }
    )
    .eq("uid", clientID);

  if (error) {
    console.log("ERR: Error updating/inserting row", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    console.log(data);
    return NextResponse.json({ data: data }, { status: 200 });
  }
}
