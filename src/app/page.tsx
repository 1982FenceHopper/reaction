import HomeComponents from "@/components/home/Home";

import { readUserSession } from "@/utils/supabase/actions";
import { redirect } from "next/navigation";

export default async function page() {
  const { data } = await readUserSession();

  if (data.session) {
    return redirect("/player");
  }

  return (
    <div>
      <HomeComponents />
    </div>
  );
}
