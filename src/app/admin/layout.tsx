import Link from "next/link";
import { requireAdmin } from "@/lib/auth/require-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>
    <nav aria-label="Administration" className="container" style={{ display: "flex", flexWrap: "wrap", gap: 20, paddingTop: 24 }}>
      <Link href="/admin/restaurants">Restaurants</Link>
      <Link href="/admin/listings">Listing moderation</Link>
      <Link href="/admin/reviews">Community reviews</Link>
      <Link href="/admin/requests">Restaurant inquiries</Link>
    </nav>
    {children}
  </>;
}
