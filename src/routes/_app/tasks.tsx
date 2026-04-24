import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const { effectiveRole } = useAuth();
  const { assignments, disasters, teams, updateAssignmentStatus } = useTacticalData();

  const isAdmin = effectiveRole === "admin";
  // For team users, show only assignments — in real life we'd filter by team membership.
  // In demo mode and for simplicity, show all but allow updates everywhere.
  const filtered = isAdmin
    ? assignments
    : assignments.filter(a => a.status !== "completed" || true);

  function handleAction(id: string, status: "started" | "completed") {
    updateAssignmentStatus(id, status);
    toast.success(`Marked ${status}`);
  }

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">{isAdmin ? "All Tasks" : "My Tasks"}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isAdmin ? "Track every operation across the field." : "Mark progress as your team executes."}
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((a, i) => {
          const d = disasters.find(x => x.id === a.disaster_id);
          const t = teams.find(x => x.id === a.team_id);
          if (!d || !t) return null;
          return (
            <div key={a.id} className={`glass rounded-xl p-5 space-y-3 animate-scale-in animate-stagger-${Math.min(i + 1, 5)} hover:border-primary/30 transition-all`}>
              <div className="flex items-start justify-between">
                <div>
                  <Badge variant="outline" className="text-[10px] mb-2 capitalize">{d.severity}</Badge>
                  <div className="font-display font-semibold">{d.title}</div>
                </div>
                <Badge variant={a.status === "completed" ? "default" : a.status === "started" ? "secondary" : "outline"} className="capitalize">
                  {a.status}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {d.location_label}</div>
                <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Assigned {formatDistanceToNow(new Date(a.assigned_at), { addSuffix: true })}</div>
              </div>
              <div className="text-xs p-2 rounded-md bg-muted/30 border border-border/40">
                <span className="text-muted-foreground">Team:</span> <span className="text-primary">{t.name}</span>
                {a.notes && <div className="mt-1 text-muted-foreground italic">"{a.notes}"</div>}
              </div>
              {!isAdmin && a.status !== "completed" && (
                <div className="flex gap-2">
                  {a.status === "assigned" && (
                    <Button size="sm" className="flex-1 gap-1.5" onClick={() => handleAction(a.id, "started")}>
                      <Play className="h-3.5 w-3.5" /> Start
                    </Button>
                  )}
                  {a.status === "started" && (
                    <Button size="sm" variant="default" className="flex-1 gap-1.5 bg-success text-success-foreground hover:bg-success/90" onClick={() => handleAction(a.id, "completed")}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Complete
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-20 animate-fade-in">No tasks yet.</div>
        )}
      </div>
    </div>
  );
}
