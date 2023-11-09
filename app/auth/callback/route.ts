import { Database } from "@/types/supabase";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { AuthError } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");

  try {
    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient<Database>({
        cookies: () => cookieStore,
      });
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        throw error;
      }
      return NextResponse.redirect(next ?? requestUrl.origin);
    }
  } catch (error: unknown) {
    const authError = error as AuthError;
    return NextResponse.redirect(
      `http://localhost:3000/auth/auth-code-error?message=${encodeURIComponent(
        authError.message
      )}`
    ); 
  }
}
