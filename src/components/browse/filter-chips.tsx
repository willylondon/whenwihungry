"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { updateBrowseParams } from "@/lib/browse-pagination";

const CHIPS: { label: string; query: Record<string, string> }[] = [
  { label: "All", query: {} },
  { label: "Jerk", query: { category: "jerk" } },
  { label: "Seafood", query: { category: "seafood" } },
  { label: "Kingston", query: { parish: "Kingston" } },
  { label: "Cheap Eats", query: { price: "$" } },
  { label: "Date Night", query: { q: "date night" } },
  { label: "Curry Goat", query: { q: "curry goat" } },
  { label: "Ice Cream", query: { q: "ice cream" } }
];

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  return (
    <div className="filter-chips-container" role="group" aria-label="Quick filters">
      {CHIPS.map(chip => {
        const active = chip.label === "All"
          ? !["q", "query", "search", "category", "parish", "price", "rating"].some(key => searchParams.get(key))
          : Object.entries(chip.query).every(([key, value]) => searchParams.get(key) === value);
        return <button key={chip.label} type="button" className="filter-chip" aria-pressed={active}
          onClick={() => router.push(`/browse${updateBrowseParams(searchParams.toString(), chip.query, chip.label === "All")}`)}>
          {chip.label}
        </button>;
      })}
    </div>
  );
}
