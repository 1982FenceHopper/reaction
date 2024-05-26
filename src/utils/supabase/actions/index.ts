"use server";

import { createSupabaseServerClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Client intended functions
export async function clientSignUpHandler(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  const cookieStore = cookies();

  const supabaseServer = await createSupabaseServerClient(cookieStore);
  const signUpResult = await supabaseServer.auth.signUp({
    email: data.email,
    password: data.password,
  });

  return JSON.stringify(signUpResult);
}

export async function clientLoginHandler(data: {
  email: string;
  password: string;
}) {
  const cookieStore = cookies();

  const supabaseServer = await createSupabaseServerClient(cookieStore);
  const loginResult = await supabaseServer.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  return JSON.stringify(loginResult);
}

// Server intended functions
export async function readUserSession() {
  const cookieStore = cookies();

  const supabaseServer = await createSupabaseServerClient(cookieStore);

  return supabaseServer.auth.getSession();
}
