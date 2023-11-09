"use server";

import { GenericResponseType } from "@/types";
import { Database } from "@/types/supabase";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const supabase = createServerActionClient<Database>({ cookies });

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
    const avatarFile = formData.get("avatar") as File;
    // Check if avatarFile.size is less than or equal to 2MB
    const maxSizeInBytes = 2 * 1024 * 1024; // 2MB in bytes
    if (avatarFile.size > maxSizeInBytes) {
      // The file size is within the allowed limit (2MB or less)
      throw "Avatar cannot exceed 2MB";
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const user = session?.user;

    if (!user) {
      throw "User not found in session";
    }

    const { data: updateUserData, error: updateProfileError } = await supabase
      .from("profiles")
      .update({ username, status })
      .eq("id", user.id);

    if (updateProfileError) {
      throw updateProfileError.message;
    }

    if (avatarFile) {
      const { data: uploadedAvatarFile, error: uploadAvatarFileError } =
        await supabase.storage
          .from("user-avatars")
          .upload(`${user.id}/${avatarFile.name}`, avatarFile, {
            cacheControl: "3600",
            upsert: true,
          });

      if (uploadAvatarFileError) {
        throw uploadAvatarFileError.message;
      }

      const uploadedAvatarFilePath = uploadedAvatarFile.path;

      const { data: bucketData } = await supabase.storage
        .from("user-avatars")
        .getPublicUrl(uploadedAvatarFilePath);

      const { data: updateAvatarUrl, error: updateAvatarUrlError } =
        await supabase
          .from("profiles")
          .update({ avatar_url: bucketData.publicUrl })
          .eq("id", user.id);

      if (updateAvatarUrlError) {
        throw updateAvatarUrlError.message;
      }
    }

    revalidatePath("/");
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

export async function resetPassword(_: any, formData: FormData) {
  const email = String(formData.get("email"));

  try {
    const { count, error: e } = await supabase
      .from("user_emails")
      .select("*", { count: "exact", head: true })
      .eq("email", email);

    if (!count) {
      throw `${email} does not exist in our records.`;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        "http://localhost:3000/auth/callback?next=http://localhost:3000/auth/forgot-password",
    });

    console.log(error);

    if (error) {
      throw error.message;
    }

    return {
      message: `Please check ${email} for the reset password link.`,
      status: true,
    };
  } catch (error) {
    return {
      message: error,
      status: false,
    };
  }
}
