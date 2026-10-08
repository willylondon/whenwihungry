import Link from "next/link";
import { redirect } from "next/navigation";

import { updatePasswordAction } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";
import { authErrorMessage, authNoticeMessage } from "@/lib/auth/messages";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Choose a New Password" };

export default async function ResetPasswordPage({ searchParams }: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.is_anonymous) redirect("/auth/forgot-password?error=link");
  const error = authErrorMessage(params.error);
  const notice = authNoticeMessage(params.notice);
  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div><h1>Choose a new password.</h1><p>Use 8–128 characters. Spaces in your password are preserved.</p></div>
        <form action={updatePasswordAction} className="card form-card">
          {error ? <p className="form-alert" role="alert">{error}</p> : null}
          {notice ? <p className="form-alert" role="status">{notice}</p> : null}
          <PasswordField label="New password" minLength={8} name="password" />
          <PasswordField label="Confirm new password" minLength={8} name="confirmPassword" />
          <button className="btn btn-primary" type="submit">Update password</button>
          <Link href="/">Back to WhenWiHungry</Link>
        </form>
      </div>
    </section>
  );
}
