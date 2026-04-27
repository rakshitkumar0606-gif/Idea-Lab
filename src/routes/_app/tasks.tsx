import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Play, CheckCircle2, MapPin, Clock, AlertCircle, Heart, Building2, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { useState, useMemo } from "react";

export const Route = createFileRoute("/_app/tasks")({
  component: TasksPage,
});

function TasksPage() {
  const { effectiveRole, profile, isDemo } = useAuth();
  const { assignments, disasters, teams, resources, updateAssignmentStatus, completeAssignmentWithReport } = useTacticalData();
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "assigned" | "started" | "completed">("all");
  const [completionFor, setCompletionFor] = useState<string | null>(null);
  const [resourceType, setResourceType] = useState("");
  const [resourceUsed, setResourceUsed] = useState("");
  const [completionNotes, setCompletionNotes] = useState("");

  const isAdmin = effectiveRole === "admin";
  
  // Filter assignments based on role
  const filtered = useMemo(() => {
    let result = assignments;
    
    if (!isAdmin && profile?.team_id) {
      // Team members only see their team's tasks
      result = assignments.filter(a => {
        const team = teams.find(t => t.id === a.team_id);
        return team && team.id === profile.team_id;
      });
    }
    
    // Apply status filter
    if (filter !== "all") {
      result = result.filter(a => a.status === filter);
    }
    
    return result.sort(
      (a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime(),
    );
  }, [assignments, isAdmin, profile?.team_id, teams, filter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter(a => a.status === "assigned").length,
    active: filtered.filter(a => a.status === "started").length,
    completed: filtered.filter(a => a.status === "completed").length,
  }), [filtered]);

  async function handleAction(id: string, status: "started" | "completed") {
    setUpdating(id);
    try {
      await updateAssignmentStatus(id, status);
      toast.success(`Task marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update task");
    } finally {
      setUpdating(null);
    }
  }

  async function handleCompleteWithReport() {
    if (!completionFor) return;
    if (!resourceType.trim()) {
      toast.error("Select resource type");
      return;
    }

    const used = Number(resourceUsed);
    if (!Number.isFinite(used) || used <= 0) {
      toast.error("Enter valid resource usage");
      return;
    }

    setUpdating(completionFor);
    try {
      await completeAssignmentWithReport(completionFor, {
        resourceType: resourceType.trim(),
        resourceUsed: used,
        completionNotes: completionNotes.trim(),
      });
      toast.success("Task completed and report submitted");
      setCompletionFor(null);
      setResourceUsed("");
      setCompletionNotes("");
    } catch (err) {
      toast.error("Failed to submit completion report");
    } finally {
      setUpdating(null);
    }
  }

  const resourceTypes = useMemo(
    () => Array.from(new Set(resources.map(r => r.type))).sort((a, b) => a.localeCompare(b)),
    [resources],
  );

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "assigned":
        return "outline";
      case "started":
        return "secondary";
      case "completed":
        return "default";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800";
      case "started":
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800";
      case "completed":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800";
      default:
        return "border-border/40";
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">
          {isAdmin ? "All Tasks" : "My Tasks"}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isAdmin 
            ? "Track every operation across the field. Monitor team progress and task completion."
            : "View and manage tasks assigned to your team. Update progress as you execute operations."
          }
        </p>
      </div>

      {!isAdmin && (
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900 dark:text-blue-100">
            <p className="font-semibold mb-1">How to update task status:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>When you start working on a task, click "Start Task"</li>
              <li>When your team finishes, click "Mark Complete"</li>
              <li>The admin and your team will be notified of updates</li>
            </ol>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 space-y-2 border-border/40">
          <span className="text-sm text-muted-foreground">Total Tasks</span>
          <div className="text-2xl font-bold">{stats.total}</div>
        </Card>
        <Card className="p-4 space-y-2 border-border/40">
          <span className="text-sm text-muted-foreground">Pending</span>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
        </Card>
        <Card className="p-4 space-y-2 border-border/40">
          <span className="text-sm text-muted-foreground">In Progress</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.active}</div>
        </Card>
        <Card className="p-4 space-y-2 border-border/40">
          <span className="text-sm text-muted-foreground">Completed</span>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
        </Card>
      </div>

      {/* Filters */}
      <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
        <TabsList className="grid grid-cols-4 w-full max-w-md">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="assigned">Pending ({stats.pending})</TabsTrigger>
          <TabsTrigger value="started">Active ({stats.active})</TabsTrigger>
          <TabsTrigger value="completed">Done ({stats.completed})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <Card className="col-span-full p-12 text-center border-border/40">
            <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">{isAdmin ? "No tasks yet." : "You don't have any tasks assigned yet."}</p>
          </Card>
        ) : (
          filtered.map((a, i) => {
            const d = disasters.find(x => x.id === a.disaster_id);
            const t = teams.find(x => x.id === a.team_id);
            if (!d || !t) return null;

            return (
              <Card
                key={a.id}
                className={`p-5 space-y-3 animate-scale-in hover:shadow-md transition-all border ${getStatusColor(a.status)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <Badge variant="outline" className="text-[10px] mb-2 capitalize">
                      {d.severity}
                    </Badge>
                    <div className="font-display font-semibold text-base leading-tight">
                      {d.title}
                    </div>
                  </div>
                  <Badge variant={getStatusBadgeVariant(a.status)} className="capitalize flex-shrink-0">
                    {a.status === "assigned"
                      ? "Pending"
                      : a.status === "started"
                      ? "Active"
                      : "Complete"}
                  </Badge>
                </div>

                <div className="text-sm text-muted-foreground space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="line-clamp-1">{d.location_label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Assigned {formatDistanceToNow(new Date(a.assigned_at), { addSuffix: true })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {t.type === "ngo" ? (
                      <Heart className="h-3.5 w-3.5 flex-shrink-0 text-red-500" />
                    ) : (
                      <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-blue-500" />
                    )}
                    <span className="line-clamp-1">{t.name}</span>
                  </div>
                </div>

                {/* Demo indicator: make admin->team assignment visible in demo mode */}
                {isDemo && !isAdmin && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span className="italic">Assigned by Admin (demo)</span>
                  </div>
                )}

                {a.notes && (
                  <div className="text-xs p-2 rounded-md bg-muted/30 border border-border/40">
                    <span className="text-muted-foreground font-semibold">Notes: </span>
                    <span className="text-muted-foreground italic">{a.notes}</span>
                  </div>
                )}

                {!isAdmin && a.status !== "completed" && (
                  <div className="flex gap-2 pt-2">
                    {a.status === "assigned" && (
                      <Button
                        size="sm"
                        className="flex-1 gap-1.5"
                        onClick={() => handleAction(a.id, "started")}
                        disabled={updating === a.id}
                      >
                        {updating === a.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                        Start Task
                      </Button>
                    )}
                    {a.status === "started" && (
                      <Button
                        size="sm"
                        variant="default"
                        className="flex-1 gap-1.5 bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => {
                          setCompletionFor(a.id);
                          const defaultType = resourceTypes[0] ?? "";
                          setResourceType(defaultType);
                        }}
                        disabled={updating === a.id}
                      >
                        {updating === a.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        Mark Complete
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {completionFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setCompletionFor(null)} />
          <div className="relative w-full max-w-md rounded-xl border border-border/40 bg-background p-5 shadow-2xl space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Complete Task Report</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Submit resource usage so admin can track completion and inventory.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Resource Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
                className="w-full rounded-md border border-border/40 bg-muted/30 px-3 py-2 text-sm"
              >
                <option value="" disabled>Select resource type</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Total Resource Used</label>
              <Input
                type="number"
                min="1"
                value={resourceUsed}
                onChange={(e) => setResourceUsed(e.target.value)}
                placeholder="Enter quantity used"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Completion Notes</label>
              <textarea
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Summarize what your team completed"
                className="min-h-[100px] w-full rounded-md border border-border/40 bg-muted/30 p-2.5 text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setCompletionFor(null)}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleCompleteWithReport} disabled={updating === completionFor}>
                {updating === completionFor ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Submitting
                  </>
                ) : (
                  "Submit & Complete"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
