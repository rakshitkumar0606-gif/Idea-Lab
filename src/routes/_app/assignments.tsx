import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Loader2, CheckCircle2, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/assignments")({
  component: Assignments,
});

// Haversine
function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

function Assignments() {
  const { effectiveRole } = useAuth();
  const navigate = useNavigate();
  const { disasters, teams, assignments, assignTeam } = useTacticalData();
  const [selected, setSelected] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const stats = useMemo(() => {
    const ngoTeams = teams.filter((t: any) => t.type === "ngo");
    const govtTeams = teams.filter((t: any) => t.type === "government");
    return { 
      ngoAvailable: ngoTeams.filter((t: any) => t.availability_status === "available").length,
      ngoWorking: ngoTeams.filter((t: any) => t.availability_status === "busy").length,
      govtAvailable: govtTeams.filter((t: any) => t.availability_status === "available").length,
      govtWorking: govtTeams.filter((t: any) => t.availability_status === "busy").length
    };
  }, [teams]);

  useEffect(() => {
    if (effectiveRole && effectiveRole !== "admin") navigate({ to: "/dashboard" });
  }, [effectiveRole, navigate]);

  const activeDisasters = disasters.filter(d => d.status !== "completed");
  const selectedDisaster = disasters.find(d => d.id === selected) ?? activeDisasters[0];
  const assignedTeamIds = new Set(
    assignments.filter(a => a.disaster_id === selectedDisaster?.id && a.status !== "completed").map(a => a.team_id)
  );

  // AI-style scoring (deterministic, runs locally — no extra service call needed for v1)
  const scored = useMemo(() => {
    if (!selectedDisaster) return [];
    return teams
      .filter(t => t.availability_status !== "offline")
      .map(t => {
        const d = distKm(t, selectedDisaster);
        const availScore = t.availability_status === "available" ? 1 : 0.4;
        const workloadPenalty = Math.max(0, 1 - t.workload * 0.2);
        const distScore = Math.max(0, 1 - d / 2000);
        const score = (distScore * 0.5 + availScore * 0.3 + workloadPenalty * 0.2) * 100;
        return { team: t, distance: d, score };
      })
      .sort((a, b) => {
        if (a.distance !== b.distance) return a.distance - b.distance;
        return b.score - a.score;
      });
  }, [teams, selectedDisaster]);

  function handleAssign(teamId: string) {
    if (!selectedDisaster) return;
    assignTeam(selectedDisaster.id, teamId);
    toast.success("Team assigned. Disaster moved to In Progress.");
  }

  function handleAiSuggest() {
    setAiLoading(true);
    setTimeout(() => {
      const best = scored.find(s => !assignedTeamIds.has(s.team.id));
      if (best) {
        toast.success(`AI suggests: ${best.team.name} (${best.distance.toFixed(0)} km, score ${best.score.toFixed(0)})`, { duration: 6000 });
      } else {
        toast.info("All eligible teams are already engaged on this incident.");
      }
      setAiLoading(false);
    }, 800);
  }

  if (!selectedDisaster) {
    return <div className="text-center text-muted-foreground py-20">No active incidents to assign.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Team Assignment</h1>
        <p className="text-muted-foreground text-sm mt-1">Select an incident, then deploy one or multiple teams.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in stagger-1">
        <div className="glass p-5 rounded-xl border-l-4 border-l-primary/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">NGO Personnel</div>
            <div className="flex gap-4">
              <div>
                <div className="text-2xl font-display font-bold text-success">{stats.ngoAvailable}</div>
                <div className="text-[10px] text-muted-foreground">Available</div>
              </div>
              <div className="border-l border-border/40 pl-4">
                <div className="text-2xl font-display font-bold text-warning">{stats.ngoWorking}</div>
                <div className="text-[10px] text-muted-foreground">Working</div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="glass p-5 rounded-xl border-l-4 border-l-secondary/30 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Govt Personnel</div>
            <div className="flex gap-4">
              <div>
                <div className="text-2xl font-display font-bold text-success">{stats.govtAvailable}</div>
                <div className="text-[10px] text-muted-foreground">Available</div>
              </div>
              <div className="border-l border-border/40 pl-4">
                <div className="text-2xl font-display font-bold text-warning">{stats.govtWorking}</div>
                <div className="text-[10px] text-muted-foreground">Working</div>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-secondary/10 text-secondary">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Disaster list */}
        <div className="glass rounded-xl p-4 space-y-2 animate-slide-in-right stagger-1">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Active Incidents</div>
          {activeDisasters.map((d: any, i: number) => {
            const isSel = d.id === selectedDisaster.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelected(d.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all animate-slide-in-right stagger-${Math.min(i + 1, 5)} ${
                  isSel ? "bg-primary/10 border-primary/50" : "border-border/40 hover:bg-muted/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{d.title}</span>
                  <Badge variant="outline" className="text-[10px] capitalize">{d.severity}</Badge>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {d.location_label}
                </div>
                <Badge variant={d.status === "in_progress" ? "default" : "secondary"} className="mt-2 text-[10px] capitalize">
                  {d.status.replace("_", " ")}
                </Badge>
              </button>
            );
          })}
        </div>

        {/* Team selection */}
        <div className="lg:col-span-2 glass rounded-xl p-5 animate-scale-in stagger-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Deploying to</div>
              <div className="font-display text-lg font-semibold">{selectedDisaster.title}</div>
            </div>
            <Button variant="outline" size="sm" onClick={handleAiSuggest} disabled={aiLoading} className="gap-2 border-primary/40">
              {aiLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5 text-primary" />}
              AI suggest best team
            </Button>
          </div>

          <div className="space-y-2">
            {scored.map(({ team, distance, score }: any, i: number) => {
              const already = assignedTeamIds.has(team.id);
              return (
                <div key={team.id} className={`flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 animate-slide-in-right stagger-${Math.min(i + 1, 5)} hover:border-primary/30 transition-all`}>
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    team.availability_status === "available" ? "bg-success" :
                    team.availability_status === "busy" ? "bg-warning" : "bg-muted-foreground"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{team.name}</span>
                      <Badge variant="outline" className="text-[10px] uppercase">{team.type}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {team.location_label} · {distance.toFixed(0)} km · workload {team.workload}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">match</div>
                    <div className="font-display font-bold text-primary">{score.toFixed(0)}</div>
                  </div>
                  {already ? (
                    <Badge variant="secondary" className="gap-1"><CheckCircle2 className="h-3 w-3" /> Assigned</Badge>
                  ) : (
                    <Button size="sm" onClick={() => handleAssign(team.id)}>Assign</Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
