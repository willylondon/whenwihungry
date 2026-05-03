import Link from "next/link";

import { signInAction } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";

type SignInPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export const metadata = {
  title: "Sign In"
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <span className="eyebrow">Join the table</span>
          <h1>Sign in to recommend a spot.</h1>
          <p>
            Add restaurants, rate the places you have tried, and help the best
            spots rise naturally.
          </p>
        </div>
        <form action={signInAction} className="card form-card">
          {params.error ? <p className="form-alert">{params.error}</p> : null}
          <input name="next" type="hidden" value={params.next ?? "/add-listing"} />
          <label>
            Email
            <input name="email" required type="email" />
          </label>
          <PasswordField label="Password" name="password" />
          <button className="btn btn-primary" type="submit">
            Sign in
          </button>
          <p>
            New here? <Link href="/sign-up">Create an account</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
