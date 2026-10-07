"use server";

import { redirect } from "next/navigation";

import { safeLocalRedirect } from "@/lib/security/redirect";
import { siteUrl } from "@/lib/site-url";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { boundedString, getFormString, isEmail } from "@/lib/validation";

export async function signInAction(formData: FormData) {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password", { trim: false });
  const next = safeLocalRedirect(formData.get("next"));
  const failure = `/sign-in?error=credentials&next=${encodeURIComponent(next)}`;
  if (!isEmail(email) || password.length === 0 || password.length > 128) redirect(failure);

  let signedIn = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    signedIn = !error && Boolean(data.session);
  } catch {
    // Never expose provider errors or account details to the browser.
  }
  if (!signedIn) redirect(failure);
  redirect(next);
}

export async function signUpAction(formData: FormData) {
  const displayName = boundedString(formData.get("displayName"), { min: 1, max: 80 });
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password", { trim: false });
  const next = safeLocalRedirect(formData.get("next"));
  const suffix = `&next=${encodeURIComponent(next)}`;
  if (!displayName || !isEmail(email) || password.length < 8 || password.length > 128) {
    redirect(`/sign-up?error=invalid${suffix}`);
  }

  let succeeded = false;
  let hasSession = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: siteUrl(`/auth/callback?next=${encodeURIComponent(next)}`),
        data: { display_name: displayName }
      }
    });
    succeeded = !error;
    hasSession = !error && Boolean(data.session);
  } catch {
    // Configuration/provider failures use the same safe error as other failures.
  }
  if (!succeeded) redirect(`/sign-up?error=signup${suffix}`);
  if (!hasSession) redirect(`/sign-in?notice=confirm-email${suffix}`);
  redirect(next);
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getFormString(formData, "email");
  if (!isEmail(email)) redirect("/auth/forgot-password?error=email");
  let succeeded = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: siteUrl("/auth/callback?next=%2Fauth%2Freset-password")
    });
    succeeded = !error;
  } catch {
    // Preserve account privacy and avoid returning provider details.
  }
  if (!succeeded) redirect("/auth/forgot-password?error=reset");
  redirect("/auth/forgot-password?notice=reset-sent");
}

export async function updatePasswordAction(formData: FormData) {
  const password = getFormString(formData, "password", { trim: false });
  const confirmation = getFormString(formData, "confirmPassword", { trim: false });
  if (password.length < 8 || password.length > 128) redirect("/auth/reset-password?error=invalid");
  if (password !== confirmation) redirect("/auth/reset-password?error=mismatch");

  let authenticated = false;
  let updated = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    authenticated = !error && Boolean(data.user) && !data.user?.is_anonymous;
    if (authenticated) {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      updated = !updateError;
    }
  } catch {
    // A failure must not be reported as a successful password change.
  }
  if (!authenticated) redirect("/auth/forgot-password?error=link");
  if (!updated) redirect("/auth/reset-password?error=password");
  redirect("/auth/reset-password?notice=password-updated");
}

export async function signOutAction() {
  let succeeded = false;
  try {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    succeeded = !error;
  } catch {
    // Let the user retry instead of claiming the session was removed.
  }
  if (!succeeded) redirect("/sign-in?error=signout");
  redirect("/");
}
