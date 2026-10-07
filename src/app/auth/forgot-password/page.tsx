import Link from "next/link";

import { requestPasswordResetAction } from "@/app/auth/actions";
import { authErrorMessage, authNoticeMessage } from "@/lib/auth/messages";

export const metadata = { title: "Reset Your Password" };

export default async function ForgotPasswordPage({ searchParams }: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const error = authErrorMessage(params.error);
  const notice = authNoticeMessage(params.notice);
  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div><h1>Forgot your password?</h1><p>Enter your account email to request a reset link.</p></div>
        <form action={requestPasswordResetAction} className="card form-card">
          {error ? <p className="form-alert" role="alert">{error}</p> : null}
          {notice ? <p className="form-alert" role="status">{notice}</p> : null}
          <label>Email<input autoComplete="email" maxLength={254} name="email" required type="email" /></label>
          <button className="btn btn-primary" type="submit">Send reset link</button>
          <Link href="/sign-in">Back to sign in</Link>
        </form>
      </div>
    </section>
  );
}
