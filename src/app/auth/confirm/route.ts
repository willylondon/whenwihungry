import { authRedirectResponse } from "@/lib/auth/redirect-response";
import { safeLocalRedirect } from "@/lib/security/redirect";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  if (tokenHash && tokenHash.length <= 1024 && (type === "email" || type === "signup" || type === "recovery")) {
    try {
      const supabase = await createSupabaseServerClient();
      const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      if (!error && data.session) {
        const next = type === "recovery" ? "/auth/reset-password" : safeLocalRedirect(params.get("next"));
        return authRedirectResponse(next);
      }
    } catch {
      // Do not echo auth tokens or provider errors into a page or redirect.
    }
  }
  return authRedirectResponse("/sign-in?error=link");
}
