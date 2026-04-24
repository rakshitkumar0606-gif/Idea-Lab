import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { StatCard } from "@/components/StatCard";
import { CoordinationMap } from "@/components/CoordinationMap";
import { AlertTriangle, Users, CheckCircle2, Activity, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { effectiveRole, effectiveName } = useAuth();
  const { teams, disasters, assignments, resources } = useTacticalData();

  const active = disasters.filter(d => d.status === "in_progress").length;
  const pending = disasters.filter(d => d.status === "pending").length;
  const completed = disasters.filter(d => d.status === "completed").length;
  const availableTeams = teams.filter(t => t.availability_status === "available").length;

  const isAdmin = effectiveRole === "admin";

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div className="animate-fade-in-up">
          <h1 className="text-3xl font-display font-bold">
            {isAdmin ? "Operations Overview" : "My Mission Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, <span className="text-primary">{effectiveName}</span>. {active} active incidents on the grid.
          </p>
        </div>
        {isAdmin && (
          <Link to="/assignments">
            <Button className="gap-2">
              <Zap className="h-4 w-4" /> Assign teams <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active incidents" value={active} icon={<Activity className="h-5 w-5" />} accent="warning" sub={`${pending} pending`} />
        <StatCard label="Available teams" value={availableTeams} icon={<Users className="h-5 w-5" />} accent="success" sub={`of ${teams.length} total`} />
        <StatCard label="Completed ops" value={completed} icon={<CheckCircle2 className="h-5 w-5" />} accent="primary" />
        <StatCard label="Critical alerts" value={disasters.filter(d => d.severity === "critical").length} icon={<AlertTriangle className="h-5 w-5" />} accent="destructive" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass rounded-xl p-4 animate-scale-in stagger-2">
          <div className="flex items-center justify-between mb-3 px-2">
            <h2 className="font-display font-semibold">Live Coordination Map</h2>
            <Link to="/map" className="text-xs text-primary hover:underline">Expand →</Link>
          </div>
          <div className="h-[420px] rounded-lg overflow-hidden border border-border/20 shadow-inner">
            <CoordinationMap disasters={disasters} teams={teams} resources={resources} />
          </div>
        </div>

        <div className="glass rounded-xl p-5 space-y-3">
          <h2 className="font-display font-semibold">Recent Activity</h2>
          <div className="space-y-2 max-h-[400px] overflow-auto scrollbar-thin">
            {assignments.slice(0, 8).map(a => {
              const d = disasters.find(x => x.id === a.disaster_id);
              const t = teams.find(x => x.id === a.team_id);
              return (
                <div key={a.id} className="p-3 rounded-lg bg-muted/30 border border-border/40 animate-slide-in-right hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <Badge variant={a.status === "completed" ? "default" : "outline"} className="text-[10px]">
                      {a.status}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(a.assigned_at), { addSuffix: true })}
                    </span>
                  </div>
                  <div className="mt-1 text-sm font-medium truncate">{d?.title ?? "Operation"}</div>
                  <div className="text-xs text-muted-foreground truncate group-hover:text-primary transition-colors">→ {t?.name ?? "Team"}</div>
                </div>
              );
            })}
            {assignments.length === 0 && <div className="text-sm text-muted-foreground p-4 text-center">No assignments yet.</div>}
          </div>
        </div>
      </div>

      {/* Resource snapshot */}
      <div className="glass rounded-xl p-5">
        <h2 className="font-display font-semibold mb-3">Resource Stockpile</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {resources.map(r => (
            <div key={r.id} className="p-3 rounded-lg bg-muted/30 border border-border/40 animate-fade-in-up hover:border-primary/50 transition-colors">
              <div className="text-xs text-muted-foreground">{r.location_label}</div>
              <div className="font-display font-bold text-primary">{r.quantity.toLocaleString()}</div>
              <div className="text-xs">{r.type}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
