import Link from "next/link";

import { submitListingAction } from "@/app/add-listing/actions";
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

const parishes = [
  "Kingston",
  "St. Andrew",
  "St. Catherine",
  "St. James",
  "St. Ann",
  "Portland",
  "Manchester",
  "Clarendon",
  "Westmoreland",
  "St. Elizabeth",
  "Hanover",
  "Trelawny",
  "St. Mary",
  "St. Thomas"
];

const categories = [
  "Jerk",
  "Cook Shop",
  "Lunch Run",
  "Seafood",
  "Patties",
  "Date Night",
  "Cheap Eats",
  "Late Night"
];

export default async function AddListingPage({ searchParams }: AddListingPageProps) {
  const [params, user] = await Promise.all([searchParams, getCurrentUser()]);

  return (
    <section className="section auth-page">
      <div className="container auth-shell">
        <div>
          <span className="eyebrow">Community picks</span>
          <h1>Add a restaurant for WWH to check out.</h1>
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
          {params.error ? <p className="form-alert">{params.error}</p> : null}
          <fieldset disabled={!user}>
            <label>
              Restaurant name
              <input name="name" required type="text" />
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
                <input name="area" placeholder="Half Way Tree, Mobay, Port Royal..." type="text" />
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
                </select>
              </label>
            </div>
            <label>
              Why should people know it?
              <textarea
                maxLength={500}
                name="description"
                required
                rows={5}
              />
            </label>
            <label>
              Address
              <input name="address" type="text" />
            </label>
            <div className="form-grid">
              <label>
                Phone
                <input name="phone" type="tel" />
              </label>
              <label>
                Website
                <input name="website" type="url" />
              </label>
            </div>
            <div className="form-grid">
              <label>
                Instagram
                <input name="instagram" placeholder="@restaurant" type="text" />
              </label>
              <label>
                TikTok
                <input name="tiktok" placeholder="@restaurant" type="text" />
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
