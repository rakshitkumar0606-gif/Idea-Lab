import { ClientOnly } from "@tanstack/react-router";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import type { DemoTeam, DemoDisaster, DemoResource } from "@/lib/demoData";

// Fix default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const disasterIcon = (severity: string) => {
  const color =
    severity === "critical" ? "#ef4444" :
    severity === "high" ? "#f59e0b" :
    severity === "medium" ? "#eab308" : "#84cc16";
  return L.divIcon({
    className: "",
    html: `<div style="position:relative;width:36px;height:36px;display:flex;align-items:center;justify-content:center">
      <span style="position:absolute;inset:0;border-radius:999px;background:${color};opacity:0.3;animation:pulse-ring 2s infinite"></span>
      <span style="position:relative;width:14px;height:14px;border-radius:999px;background:${color};box-shadow:0 0 12px ${color}, 0 0 0 2px rgba(255,255,255,0.9)"></span>
    </div>`,
    iconSize: [36, 36], iconAnchor: [18, 18],
  });
};
const teamIcon = (type: string) => {
  const color = type === "government" ? "#06b6d4" : "#a855f7";
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:4px;background:${color};border:2px solid white;box-shadow:0 0 10px ${color}"></div>`,
    iconSize: [18, 18], iconAnchor: [9, 9],
  });
};
const resourceIcon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:3px;background:#10b981;border:2px solid white;transform:rotate(45deg)"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7],
});

type Props = {
  disasters: DemoDisaster[];
  teams: DemoTeam[];
  resources?: DemoResource[];
  routes?: { from: [number, number]; to: [number, number] }[];
  height?: string;
};

function MapInner({ disasters, teams, resources = [], routes = [], height = "100%" }: Props) {
  const indiaBounds: L.LatLngBoundsExpression = [
    [6.5, 68.0], // Southwest
    [37.5, 97.5], // Northeast
  ];

  return (
    <div style={{ height, width: "100%" }} className="rounded-xl overflow-hidden border border-border/50">
      <MapContainer
        center={[22.5, 80]}
        zoom={5}
        minZoom={5}
        maxBounds={indiaBounds}
        maxBoundsViscosity={1.0}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {disasters.map(d => (
          <Marker key={d.id} position={[d.lat, d.lng]} icon={disasterIcon(d.severity)}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{d.title}</div>
                <div className="text-xs opacity-70">{d.location_label}</div>
                <div className="mt-1 text-xs">Severity: <b>{d.severity}</b> — {d.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {teams.map(t => (
          <Marker key={t.id} position={[t.lat, t.lng]} icon={teamIcon(t.type)}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{t.name}</div>
                <div className="text-xs">{t.type.toUpperCase()} — {t.availability_status}</div>
                <div className="text-xs opacity-70">{t.location_label}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {resources.map(r => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={resourceIcon}>
            <Popup>
              <div className="text-sm">
                <div className="font-bold">{r.type}</div>
                <div className="text-xs">Qty: {r.quantity} @ {r.location_label}</div>
              </div>
            </Popup>
          </Marker>
        ))}
        {routes.map((r, i) => (
          <Polyline key={i} positions={[r.from, r.to]} pathOptions={{ color: "#22d3ee", weight: 2, dashArray: "6 8", opacity: 0.7 }} />
        ))}
      </MapContainer>
    </div>
  );
}

export function CoordinationMap(props: Props) {
  return (
    <ClientOnly fallback={<div className="rounded-xl bg-muted/30 animate-pulse" style={{ height: props.height ?? "500px" }} />}>
      <MapInner {...props} />
    </ClientOnly>
  );
}
