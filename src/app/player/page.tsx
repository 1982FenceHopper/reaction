import MainPlayer from "@/components/player/MainPlayer";
import { readUserSession } from "@/utils/supabase/actions";
import { redirect } from "next/navigation";

export default async function Player() {
  //* START: Supabase Page Protection
  const { data } = await readUserSession();

  if (!data.session) {
    return redirect("/");
  }
  //* END: Supabase Page Protection

  return (
    <div>
      <MainPlayer />
    </div>
  );
}
