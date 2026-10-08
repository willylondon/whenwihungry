import Link from "next/link";

import { submitListingAction } from "@/app/add-listing/actions";
import { PARISHES as parishes, LISTING_CATEGORIES as categories } from "./validation";
import { getCurrentUser } from "@/lib/community";

type AddListingPageProps = {
  searchParams: Promise<{
    error?: string;
    submitted?: string;
    welcome?: string;
  }>;
};

export const metadata = {
  title: "Add a Restaurant"
};

export default async function AddListingPage({ searchParams }: AddListingPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <h1>Suggest a food spot</h1>
          <p>
            Submit the spot with enough context for people to trust it. New
            listings stay pending until approved.
          </p>
          {!user ? (
            <Link className="btn btn-outline" href="/sign-in?next=/add-listing">
              Sign in to add a listing
            </Link>
          ) : null}
        </div>
        <form action={submitListingAction} className="card form-card">
          {params.submitted ? (
            <p className="form-success">Listing received. It will show after approval.</p>
          ) : null}
          {params.welcome ? (
            <p className="form-success">Account ready. Add your first spot below.</p>
          ) : null}
          {params.error ? <p role="alert" className="form-alert">{params.error === "invalid" ? "Check all fields. Use a listed parish/category, 10–500 characters of description, and valid links." : "Your listing could not be confirmed. Please retry later or check for an existing submission before retrying."}</p> : null}
          <fieldset disabled={!user}>
            <label>
              Restaurant name
              <input name="name" required minLength={2} maxLength={160} type="text" />
            </label>
            <div className="form-grid">
              <label>
                Parish
                <select name="parish" required>
                  <option value="">Choose parish</option>
                  {parishes.map((parish) => (
                    <option key={parish}>{parish}</option>
                  ))}
                </select>
              </label>
              <label>
                Area
                <input maxLength={160} name="area" placeholder="Half Way Tree, Mobay, Port Royal..." type="text" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Category
                <select name="category" required>
                  <option value="">Choose category</option>
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <label>
                Price vibe
                <select name="priceRange">
                  <option value="">Choose price</option>
                  <option>$</option>
                  <option>$$</option>
                  <option>$$$</option>
                  <option>$$$$</option>
                </select>
              </label>
            </div>
            <label>
              Why should people know it?
              <textarea
                minLength={10}
                maxLength={500}
                name="description"
                required
                rows={5}
              />
            </label>
            <label>
              Address
              <input maxLength={300} name="address" type="text" />
            </label>
            <div className="form-grid">
              <label>
                Phone
                <input maxLength={40} name="phone" type="tel" />
              </label>
              <label>
                Website
                <input maxLength={2048} name="website" type="url" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Instagram
                <input maxLength={300} name="instagram" placeholder="@restaurant" type="text" />
              </label>
              <label>
                TikTok
                <input maxLength={300} name="tiktok" placeholder="@restaurant" type="text" />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              Submit listing
            </button>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
