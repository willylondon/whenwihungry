import Link from "next/link";

/** For restaurant owners: the one red band on the page. */
export function GetReviewedCta() {
  return <section className="cta-band" aria-labelledby="cta-heading">
    <div className="container cta-band-inner">
      <div>
        <h2 id="cta-heading">Think your food can handle it?</h2>
        <p>Request a review. We come unannounced and pay our own bill. If a meal is ever hosted or discounted, the review says so up front.</p>
      </div>
      <Link className="btn-board" href="/get-reviewed">Request a review</Link>
    </div>
  </section>;
}
