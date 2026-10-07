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

export type MapPlace = Pick<Place, "slug" | "name" | "area" | "parish" | "lat" | "lng">;

type MapViewWrapperProps = {
  places: MapPlace[];
};

export function MapViewWrapper({ places }: MapViewWrapperProps) {
  return <MapView places={places} />;
}
