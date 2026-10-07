"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { submitReviewRequestAction, type ReviewRequestState } from "./actions";

type Props = {
  foodSpotCountLabel?: string | null;
  signedIn: boolean;
  enabled: boolean;
  requestId: string;
  queueUnavailable?: boolean;
  existingRequest?: { id: string; status: string } | null;
};
const initialState: ReviewRequestState = { status: "idle", message: "" };

export function GetReviewedClient({ foodSpotCountLabel, signedIn, enabled, requestId, queueUnavailable, existingRequest }: Props) {
  const [fields, setFields] = useState({ name: "", restaurant: "", location: "", email: "", phone: "", message: "" });
  const change = (key: keyof typeof fields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFields(current => ({ ...current, [key]: event.target.value }));
  const [state, action, pending] = useActionState(submitReviewRequestAction, initialState);
  const hasOpenRequest = existingRequest && ["pending", "in_review"].includes(existingRequest.status);
  return (
    <div style={{ background: "var(--wwh-bg)", minHeight: "100vh" }}>
      <section style={{ padding: "72px 0", background: "var(--wwh-surface)", borderBottom: "1px solid var(--wwh-border)" }}>
        <div className="container" style={{ maxWidth: 1080 }}>
          <span className="eyebrow">For restaurants</span>
          <h1 style={{ maxWidth: "14ch" }}>Think your food can handle it?</h1>
          <p style={{ maxWidth: 660 }}>Request consideration for an independent review. Your restaurant may be selected for an anonymous visit; a request never guarantees coverage or a positive verdict.</p>
          {foodSpotCountLabel && <p>{foodSpotCountLabel} food spots in the directory</p>}
        </div>
      </section>
      <section className="section">
        <div className="container get-reviewed-grid" style={{ maxWidth: 1080 }}>
          <div>
            <h2>Real visits. Honest opinions.</h2>
            <p>I arrive unannounced and pay my own bill. If selected, the visit may happen without notice. If a meal is ever hosted or discounted, the review says so up front.</p>
            <p>A directory listing is not a critic endorsement. To suggest a place for the directory, <Link href="/add-listing">add a listing</Link>.</p>
            <h3>What happens to your request?</h3>
            <ol style={{ lineHeight: 1.9 }}>
              <li>Your request is saved in a private restaurant inquiry queue</li>
              <li>The editorial team can review it for fit</li>
              <li>If selected, the critic may visit anonymously</li>
            </ol>
            <p>Submitting does not promise a response or a review date. Your contact details are visible to you and authorized administrators, and are not published with directory listings.</p>
          </div>
          <div className="card form-card" style={{ padding: 28 }}>
            <h2>Request a review</h2>
            {!enabled ? <p role="status">Review requests are temporarily unavailable while we finish setting up the private submission queue. Nothing can be submitted here yet. Please check back later. You can also contact <a href="https://tiktok.com/@whenwihungry" target="_blank" rel="noopener noreferrer">WhenWiHungry on TikTok</a> or <a href="https://instagram.com/whenwihungry" target="_blank" rel="noopener noreferrer">Instagram</a>.</p> : !signedIn ? <div>
              <p>Sign in to submit a request and check its status. This helps prevent spam.</p>
              <Link className="btn btn-primary" href="/sign-in?next=/get-reviewed">Sign in to request a review</Link>
            </div> : queueUnavailable ? <p role="alert">We couldn&apos;t check the inquiry queue. Refresh to try again. No request has been submitted.</p> : state.status === "success" ? <div role="status">
              <h3>Request received</h3>
              <p>{state.message}</p>
              <p>Reference: {state.requestId}</p>
              <p>This does not guarantee a review or a positive verdict.</p>
            </div> : hasOpenRequest ? <div role="status">
              <p>You already have a request in the queue.</p>
              <p>Status: {existingRequest.status === "in_review" ? "Under consideration" : "Awaiting consideration"}</p>
              <p>Reference: {existingRequest.id}</p>
            </div> : <form action={action}>
              <input type="hidden" name="request_id" value={requestId} />
              <div aria-hidden="true" style={{ position: "absolute", left: -10000, width: 1, height: 1, overflow: "hidden" }}>
                <label>Leave this blank<input type="text" name="website_confirm" tabIndex={-1} autoComplete="off" /></label>
              </div>
              {state.status === "error" && <p className="form-alert" role="alert">{state.message}</p>}
              {existingRequest && <p>Your previous request is closed. You can submit a new request below.</p>}
              <fieldset disabled={pending}>
                <label>Your name<input name="name" value={fields.name} onChange={change("name")} type="text" autoComplete="name" required minLength={2} maxLength={120} /></label>
                <label>Restaurant name<input name="restaurant" value={fields.restaurant} onChange={change("restaurant")} type="text" autoComplete="organization" required minLength={2} maxLength={160} /></label>
                <label>Location<input name="location" value={fields.location} onChange={change("location")} type="text" placeholder="Parish, area and address" required minLength={2} maxLength={240} /></label>
                <label>Contact email<input name="email" value={fields.email} onChange={change("email")} type="email" autoComplete="email" required maxLength={254} /></label>
                <label>Phone (optional)<input name="phone" value={fields.phone} onChange={change("phone")} type="tel" autoComplete="tel" maxLength={40} /></label>
                <label>Why should I visit?<textarea name="message" value={fields.message} onChange={change("message")} rows={5} required minLength={10} maxLength={3000} /></label>
                <p>By submitting, you share these details with the WhenWiHungry editorial team for review consideration.</p>
                <button type="submit" className="btn btn-primary">{pending ? "Saving request…" : "Submit request"}</button>
              </fieldset>
            </form>}
          </div>
        </div>
      </section>
      <style jsx>{`@media(max-width: 760px) { .get-reviewed-grid { grid-template-columns: 1fr !important; gap: 28px !important; } }`}</style>
    </div>
  );
}
