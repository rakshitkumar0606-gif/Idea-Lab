import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTacticalData } from "@/lib/useTacticalData";
import { CoordinationMap } from "@/components/CoordinationMap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/map")({
  component: MapView,
});

function MapView() {
  const { disasters, teams, resources, assignments } = useTacticalData();
  const [showRoutes, setShowRoutes] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  const visibleDisasters = filter === "all" ? disasters : disasters.filter(d => d.status === filter);
  const routes = showRoutes
    ? assignments
        .filter(a => a.status !== "completed")
        .map(a => {
          const d = disasters.find(x => x.id === a.disaster_id);
          const t = teams.find(x => x.id === a.team_id);
          if (!d || !t) return null;
          return { from: [t.lat, t.lng] as [number, number], to: [d.lat, d.lng] as [number, number] };
        })
        .filter(Boolean) as { from: [number, number]; to: [number, number] }[]
    : [];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-end justify-between flex-wrap gap-3 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-display font-bold">Coordination Map</h1>
          <p className="text-muted-foreground text-sm mt-1">Tactical view of incidents, teams and routes.</p>
        </div>
        <div className="flex gap-2 flex-wrap animate-fade-in stagger-2">
          {(["all", "pending", "in_progress", "completed"] as const).map(s => (
            <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)} className="capitalize hover:scale-105 transition-transform">
              {s.replace("_", " ")}
            </Button>
          ))}
          <Button size="sm" variant={showRoutes ? "default" : "outline"} onClick={() => setShowRoutes(v => !v)} className="hover:scale-105 transition-transform">
            Routes {showRoutes ? "ON" : "OFF"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 min-h-[500px] animate-scale-in stagger-2">
          <CoordinationMap disasters={visibleDisasters} teams={teams} resources={resources} routes={routes} />
        </div>

        <div className="space-y-3 overflow-auto scrollbar-thin pr-1">
          <div className="glass rounded-xl p-4 animate-slide-in-right stagger-1">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Legend</div>
            <div className="space-y-2 text-sm">
              <Legend dot="#ef4444" label="Critical incident" />
              <Legend dot="#f59e0b" label="High severity" />
              <Legend dot="#eab308" label="Medium severity" />
              <Legend dot="#06b6d4" label="Government team" square />
              <Legend dot="#a855f7" label="NGO team" square />
              <Legend dot="#10b981" label="Resource depot" diamond />
            </div>
          </div>
          <div className="glass rounded-xl p-4 animate-slide-in-right stagger-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Incidents ({visibleDisasters.length})</div>
            <div className="space-y-2 max-h-[280px] overflow-auto scrollbar-thin">
              {visibleDisasters.map(d => (
                <div key={d.id} className="p-2 rounded-lg bg-muted/30 border border-border/40 text-sm hover:bg-muted/50 transition-colors animate-fade-in-up">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{d.title}</span>
                    <Badge variant="outline" className="text-[10px]">{d.severity}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">{d.location_label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ dot, label, square, diamond }: { dot: string; label: string; square?: boolean; diamond?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="inline-block h-3 w-3"
        style={{ background: dot, borderRadius: square ? 3 : diamond ? 0 : 999, transform: diamond ? "rotate(45deg)" : undefined }}
      />
      <span>{label}</span>
    </div>
  );
}
