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
  const error = requestUrl.searchParams.get("error");
  const errorCode = requestUrl.searchParams.get("error_code");
  const errorDescription = requestUrl.searchParams.get("error_description");

  try {
    if (error) {
      throw errorDescription;
    }

    if (code) {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient<Database>({
        cookies: () => cookieStore,
      });
      const { error: authError } = await supabase.auth.exchangeCodeForSession(
        code
      );
      if (authError) {
        throw authError;
      }
      return NextResponse.redirect(next ?? requestUrl.origin);
    }
    
  } catch (error: unknown) {
    return NextResponse.redirect(
      `http://localhost:3000/auth/auth-code-error?message=${encodeURIComponent(
        error as string
      )}`
    );
  }
}
