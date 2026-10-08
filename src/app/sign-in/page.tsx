import Link from "next/link";

import { signInAction } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";
import { authErrorMessage, authNoticeMessage } from "@/lib/auth/messages";
import { safeLocalRedirect } from "@/lib/security/redirect";

type SignInPageProps = {
  searchParams: Promise<{ error?: string; notice?: string; next?: string }>;
};

export const metadata = { title: "Sign In", robots: { index: false, follow: false } };

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const next = safeLocalRedirect(params.next);
  const error = authErrorMessage(params.error);
  const notice = authNoticeMessage(params.notice);

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <h1>Sign in to recommend a spot.</h1>
          <p>Add restaurants, rate the places you have tried, and help the best spots rise naturally.</p>
        </div>
        <form action={signInAction} className="card form-card">
          {error ? <p className="form-alert" role="alert">{error}</p> : null}
          {notice ? <p className="form-alert" role="status">{notice}</p> : null}
          <input name="next" type="hidden" value={next} />
          <label>Email<input autoComplete="email" maxLength={254} name="email" required type="email" /></label>
          <PasswordField label="Password" name="password" />
          <button className="btn btn-primary" type="submit">Sign in</button>
          <p><Link href="/auth/forgot-password">Forgot your password?</Link></p>
          <p>New here? <Link href={`/sign-up?next=${encodeURIComponent(next)}`}>Create an account</Link></p>
        </form>
      </div>
    </section>
  );
}
