import { getUserRole } from "@/lib/community";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getUserRole();

  if (role !== "admin") {
    console.log("Unauthorized access attempt to /admin by non-admin user.");
    redirect("/");
  }

  return <>{children}</>;
}
