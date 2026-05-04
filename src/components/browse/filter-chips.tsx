"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CHIPS = [
  { label: "All", value: "" },
  { label: "Critic Approved", value: "critic", query: { sort: "rating", rating: "4.5" } },
  { label: "Cheap Eats", value: "cheap", query: { price: "$" } },
  { label: "Best Rated", value: "best", query: { sort: "rating" } },
  { label: "Most Reviewed", value: "popular", query: { sort: "popular" } },
  { label: "Kingston", value: "kingston", query: { parish: "Kingston" } },
  { label: "Montego Bay", value: "mobay", query: { parish: "St. James" } },
  { label: "Portland", value: "portland", query: { parish: "Portland" } }
];

export function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const handleChipClick = (chip: typeof CHIPS[0]) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Clear existing filters that might conflict
    if (chip.value === "") {
       router.push("/browse");
       return;
    }
    
    if (chip.query) {
      Object.entries(chip.query).forEach(([key, val]) => {
        params.set(key, val);
      });
    }
    
    router.push(`/browse?${params.toString()}`);
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
      {CHIPS.map((chip) => {
        const isActive = searchParams.get("parish") === chip.query?.parish || 
                        searchParams.get("price") === chip.query?.price ||
                        (chip.value === "" && !searchParams.toString());

        return (
          <button
            key={chip.label}
            onClick={() => handleChipClick(chip)}
            style={{
              padding: "8px 18px",
              borderRadius: "99px",
              background: isActive ? "var(--wwh-accent)" : "rgba(255,255,255,0.06)",
              border: isActive ? "1px solid var(--wwh-accent)" : "1px solid rgba(255,255,255,0.1)",
              color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
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
        );
      })}
      <style>{`
        .filter-chips-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
