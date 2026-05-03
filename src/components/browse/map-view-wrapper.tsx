"use client";

import dynamic from "next/dynamic";
import type { Place } from "@/data/places";

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <aside className="card map-placeholder" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "600px" }}>
      <p>Loading map...</p>
    </aside>
  )
});

type MapViewWrapperProps = {
  places: Place[];
};

export function MapViewWrapper({ places }: MapViewWrapperProps) {
  return <MapView places={places} />;
}
