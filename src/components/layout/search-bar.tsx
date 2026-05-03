"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { places } from "@/data/places";

type SearchBarProps = {
  action: string;
  buttonLabel?: string;
  defaultValue?: string;
  placeholder?: string;
};

export function SearchBar({
  action,
  buttonLabel = "Search",
  defaultValue = "",
  placeholder = "Search jerk, lunch trucks, parishes, and more"
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = query.length > 1
    ? places.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.area.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <form action={action} className="search-bar" ref={containerRef} style={{ position: "relative", overflow: "visible" }}>
      <input
        aria-label="Search places"
        className="search-input"
        name="q"
        placeholder={placeholder}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
      />
      <button className="btn btn-primary search-submit" type="submit">
        {buttonLabel}
      </button>

      {focused && suggestions.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: "120px", // leave space for the search button
          marginTop: "8px",
          background: "var(--card)",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden"
        }}>
          <span style={{ fontSize: "0.75rem", padding: "8px 16px", background: "var(--bg)", borderBottom: "1px solid var(--border)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground)" }}>
            Suggestions
          </span>
          {suggestions.map((place) => (
            <Link 
              key={place.slug} 
              href={`/places/${place.slug}`}
              style={{ padding: "12px 16px", textDecoration: "none", color: "var(--foreground)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              onClick={() => setFocused(false)}
            >
              <strong>{place.name}</strong>
              <small style={{ color: "var(--primary)" }}>{place.category} · {place.area}</small>
            </Link>
          ))}
        </div>
      )}
    </form>
  );
}
