"use server";

import { GenericResponseType } from "@/types";
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

export const postHaiku = async (_: GenericResponseType, formData: FormData) => {
  try {
    const body = String(formData.get("body"));
    const hashtags = String(formData.get("hashtags"));

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    // Insert into the 'haikus' table
    const haikusInsert = await supabase
      .from("haikus")
      .insert([
        {
          author_id: user?.id,
          body,
        },
      ])
      .select()
      .single();

    if (haikusInsert.error) {
      throw haikusInsert.error.message;
    }

    // Extract hashtags from the 'hashtags' field and split them
    const hashtagArray = hashtags.split(" ");

    // Loop through the hashtags and insert them into the 'hashtags' table
    for (const hashtag of hashtagArray) {
      if (hashtag) {
        const hashtagsInsert = await supabase
          .from("hashtags")
          .upsert([
            {
              haiku_id: haikusInsert.data.id,
              hashtag: hashtag,
            },
          ])
          .select()
          .single();

        if (hashtagsInsert.error) {
          throw hashtagsInsert.error.message;
        }
      }
    }

    revalidatePath("/");
    return { status: true, message: "" };
  } catch (error) {
    return { status: false, message: error as string };
  }
};

export const updateProfile = async (_: any, formData: FormData) => {
  try {
    const username = String(formData.get("username"));
    const status = String(formData.get("status"));

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      throw "User not found in session";
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({ username, status })
      .eq("id", user?.id);

    if (error) {
      throw error.message;
    }

    revalidatePath("/")
    return {
      status: true,
      message: "OK",
    };
  } catch (error) {
    return {
      status: false,
      message: error as string,
    };
  }
};