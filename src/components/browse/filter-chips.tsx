"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CHIPS = [
  { label: "All", value: "" },
  { label: "Jerk", value: "jerk", query: { q: "jerk" } },
  { label: "Seafood", value: "seafood", query: { q: "seafood" } },
  { label: "Kingston", value: "kingston", query: { parish: "Kingston" } },
  { label: "Cheap Eats", value: "cheap", query: { q: "cheap eats" } },
  { label: "Date Night", value: "datenight", query: { q: "date night" } }
];

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChipClick = (chip: (typeof CHIPS)[0]) => {
    if (chip.value === "") {
      router.push("/browse");
      return;
    }

    const params = new URLSearchParams();
    if (chip.query) {
      Object.entries(chip.query).forEach(([key, val]) => {
        params.set(key, val);
      });
    }

    router.push(`/browse?${params.toString()}`);
  };

  const isActive = (chip: (typeof CHIPS)[0]) => {
    if (chip.value === "") return !searchParams.toString();
    if (!chip.query) return false;
    return Object.entries(chip.query).every(
      ([key, val]) => searchParams.get(key) === val
    );
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        padding: "10px 0 24px",
        msOverflowStyle: "none",
        scrollbarWidth: "none"
      }}
      className="filter-chips-container"
    >
      {CHIPS.map((chip) => (
        <button
          key={chip.label}
          onClick={() => handleChipClick(chip)}
          style={{
            padding: "8px 18px",
            borderRadius: "99px",
            background: isActive(chip) ? "var(--wwh-accent)" : "rgba(255,255,255,0.06)",
            border: isActive(chip)
              ? "1px solid var(--wwh-accent)"
              : "1px solid rgba(255,255,255,0.1)",
            color: isActive(chip) ? "#fff" : "rgba(255,255,255,0.7)",
            fontFamily: "var(--wwh-font-body)",
            fontWeight: 600,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            cursor: "pointer",
            transition: "all 160ms ease"
          }}
        >
          {chip.label}
        </button>
      ))}
      <style>{`
        .filter-chips-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
