import { createSupabaseServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import React from "react";

export default async function SignOut({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const signOutHandler = async () => {
    "use server";

    const cookieStore = cookies();

    const supabaseServer = await createSupabaseServerClient(cookieStore);

    await supabaseServer.auth.signOut();

    redirect("/");
  };

  return <form action={signOutHandler}>{children}</form>;
}
