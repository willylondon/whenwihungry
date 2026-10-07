import { authRedirectResponse } from "@/lib/auth/redirect-response";
import { safeLocalRedirect } from "@/lib/security/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const code = params.get("code");
  if (code && code.length <= 2048 && !params.has("error")) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        return authRedirectResponse(safeLocalRedirect(params.get("next")));
      }
    } catch {
      // Expired links, missing PKCE cookies and provider errors fail closed.
    }
  }
  return authRedirectResponse("/sign-in?error=link");
}
