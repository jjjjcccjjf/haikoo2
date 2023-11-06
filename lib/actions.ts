"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const supabase = createServerActionClient({ cookies });

export async function signIn(formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath("/");
}

export async function signUp(_: any, formData: FormData) {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.VERCEL_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Please check your email to continue sign-up process.",
  };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath("/");
}
