"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { PlaceListCard } from "@/components/browse/place-list-card";
import type { Place } from "@/data/places";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

type MapViewProps = {
  places: Place[];
};

export default function MapView({ places }: MapViewProps) {
  // Center roughly on Jamaica
  const center = [18.1096, -77.2975] as [number, number];

  return (
    <div style={{ height: "600px", width: "100%", borderRadius: "12px", overflow: "hidden", zIndex: 0, border: "1px solid var(--border)", boxShadow: "var(--shadow)" }}>
      <MapContainer center={center} zoom={9} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places.map((place) => {
          if (!place.lat || !place.lng) return null;
          return (
            <Marker key={place.slug} position={[place.lat, place.lng]} icon={icon}>
              <Popup className="custom-popup">
                <div style={{ width: "320px" }}>
                  <PlaceListCard place={place} />
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
