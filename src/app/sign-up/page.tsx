import Link from "next/link";

import { signUpAction } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";
import { authErrorMessage } from "@/lib/auth/messages";
import { safeLocalRedirect } from "@/lib/security/redirect";

type SignUpPageProps = { searchParams: Promise<{ error?: string; next?: string }> };

export const metadata = { title: "Sign Up", robots: { index: false, follow: false } };

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const next = safeLocalRedirect(params.next);
  const error = authErrorMessage(params.error);

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <span className="eyebrow">Add your voice</span>
          <h1>Create an account for ratings and listings.</h1>
          <p>Your ratings and comments help When Wi Hungry recommend restaurants people are actually enjoying.</p>
        </div>
        <form action={signUpAction} className="card form-card">
          {error ? <p className="form-alert" role="alert">{error}</p> : null}
          <input name="next" type="hidden" value={next} />
          <label>Display name<input autoComplete="nickname" maxLength={80} name="displayName" required type="text" /></label>
          <label>Email<input autoComplete="email" maxLength={254} name="email" required type="email" /></label>
          <PasswordField label="Password (8–128 characters)" minLength={8} name="password" />
          <p>You may need to confirm your email before signing in.</p>
          <button className="btn btn-primary" type="submit">Sign up</button>
          <p>Already have an account? <Link href={`/sign-in?next=${encodeURIComponent(next)}`}>Sign in</Link></p>
        </form>
      </div>
    </section>
  );
}
