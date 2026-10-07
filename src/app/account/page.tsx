import Link from "next/link";
import { redirect } from "next/navigation";

import { signOutAction } from "@/app/auth/actions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Your Account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || data.user.is_anonymous) redirect("/sign-in?next=%2Faccount");

  const { data: profile, error: profileError } = await supabase.from("profiles")
    .select("role").eq("id", data.user.id).maybeSingle();

  return <section className="section auth-page">
    <div className="container auth-shell">
      <div>
        <span className="eyebrow">Your account</span>
        <h1>You’re signed in.</h1>
        <p>Signed in as {data.user.email}.</p>
      </div>
      <div className="card form-card">
        <Link className="btn btn-primary" href="/add-listing">Suggest a food spot</Link>
        <Link href="/get-reviewed">Review requests</Link>
        {!profileError && profile?.role === "admin" && <Link href="/admin/restaurants">Administration</Link>}
        <form action={signOutAction}>
          <button className="btn btn-outline" type="submit">Sign out</button>
        </form>
      </div>
    </div>
  </section>;
}
