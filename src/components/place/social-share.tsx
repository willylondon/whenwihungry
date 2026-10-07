"use client";
import { useState, useSyncExternalStore } from "react";

const noSubscription = () => () => {};

/** Compact share row: the phone's own share sheet when available, plus WhatsApp and copy link. */
export function SocialShare({ url, name }: { url: string; name: string }) {
  const [copied, setCopied] = useState(false);
  // False on the server and first paint, then the browser's real capability.
  const canNativeShare = useSyncExternalStore(noSubscription, () => typeof navigator.share === "function", () => false);
  const encodedUrl = encodeURIComponent(url);
  const encodedName = encodeURIComponent(name);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* Clipboard blocked; the link is still in the address bar. */ }
  };
  const nativeShare = () => { navigator.share({ title: name, url }).catch(() => {}); };

  return (
    <div className="share-row" aria-label={`Share ${name}`} role="group">
      {canNativeShare && <button type="button" className="share-pill share-pill-primary" onClick={nativeShare}>Share</button>}
      <a className="share-pill" href={`https://wa.me/?text=${encodedName}%20-%20${encodedUrl}`} target="_blank" rel="noopener noreferrer">
        WhatsApp<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a className="share-pill" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
        Facebook<span className="sr-only"> (opens in a new tab)</span>
      </a>
      <button type="button" className="share-pill" onClick={copyToClipboard}>{copied ? "Link copied" : "Copy link"}</button>
      <span className="sr-only" role="status" aria-live="polite">{copied ? "Link copied" : ""}</span>
    </div>
  );
}
