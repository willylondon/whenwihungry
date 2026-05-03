import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <div className="card empty-state">
          <h1>Place not found</h1>
          <p>The listing you wanted is not in this local MVP dataset yet.</p>
          <Link className="btn btn-primary" href="/browse">
            Search all places
          </Link>
        </div>
      </div>
    </section>
  );
}
