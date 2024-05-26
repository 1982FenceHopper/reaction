import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const cookieStore = cookies();
  const supabaseServer = createSupabaseServerClient(cookieStore);

  const clientRequest = await req.json();
  const clientID = await clientRequest["userid"];
  const clientFileName = await clientRequest["reqfilename"];

  const { data } = await supabaseServer.storage
    .from("user_audios")
    .getPublicUrl(`${clientID}/${clientFileName}`);

  console.log(data);
  return NextResponse.json({ data: data }, { status: 200 });
}
