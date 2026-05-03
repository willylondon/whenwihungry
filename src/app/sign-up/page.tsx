import Link from "next/link";

import { signUpAction } from "@/app/auth/actions";
import { PasswordField } from "@/components/auth/password-field";

type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export const metadata = {
  title: "Sign Up"
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <span className="eyebrow">Add your voice</span>
          <h1>Create an account for ratings and listings.</h1>
          <p>
            Your ratings and comments help When Wi Hungry recommend restaurants
            people are actually enjoying.
          </p>
        </div>
        <form action={signUpAction} className="card form-card">
          {params.error ? <p className="form-alert">{params.error}</p> : null}
          <label>
            Display name
            <input name="displayName" required type="text" />
          </label>
          <label>
            Email
            <input name="email" required type="email" />
          </label>
          <PasswordField label="Password" minLength={8} name="password" />
          <button className="btn btn-primary" type="submit">
            Sign up
          </button>
          <p>
            Already have an account? <Link href="/sign-in">Sign in</Link>
          </p>
        </form>
      </div>
    </section>
  );
}
