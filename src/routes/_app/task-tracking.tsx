import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, Clock, AlertCircle, MapPin, Building2, Heart, Zap, TrendingUp,
  Calendar, User, Loader2
} from "lucide-react";
import { formatDistanceToNow, differenceInHours, parseISO } from "date-fns";
import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/task-tracking")({
  component: TaskTracking,
});

function TaskTracking() {
  const { effectiveRole } = useAuth();
  const navigate = useNavigate();
  const { disasters, teams, assignments } = useTacticalData();
  const [filter, setFilter] = useState<"all" | "pending" | "in-progress" | "completed">("all");

  useEffect(() => {
    if (effectiveRole && effectiveRole !== "admin") navigate({ to: "/dashboard" });
  }, [effectiveRole, navigate]);

  const stats = useMemo(() => {
    const total = assignments.length;
    const pending = assignments.filter(a => a.status === "assigned").length;
    const inProgress = assignments.filter(a => a.status === "started").length;
    const completed = assignments.filter(a => a.status === "completed").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, completionRate };
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;
    if (filter !== "all") {
      filtered = assignments.filter(a => a.status === filter);
    }
    return filtered.sort(
      (a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime(),
    );
  }, [assignments, filter]);

  const getTaskDuration = (assignment: any) => {
    if (!assignment.started_at) return null;
    const startTime = parseISO(assignment.started_at);
    const endTime = assignment.completed_at ? parseISO(assignment.completed_at) : new Date();
    const hours = differenceInHours(endTime, startTime);
    if (hours === 0) return "< 1 hour";
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
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
        return "bg-muted/30 border-border/40";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case "started":
        return <Loader2 className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Task Tracking & Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time monitoring of all disaster relief operations and task completion status.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 space-y-2 border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total Tasks</span>
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Assigned</div>
        </Card>

        <Card className="p-4 space-y-2 border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pending</span>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Awaiting start</div>
        </Card>

        <Card className="p-4 space-y-2 border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">In Progress</span>
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
          </div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.inProgress}</div>
          <div className="text-xs text-muted-foreground">Currently working</div>
        </Card>

        <Card className="p-4 space-y-2 border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </div>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Tasks done</div>
        </Card>

        <Card className="p-4 space-y-2 border-border/40">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completion</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold">{stats.completionRate}%</div>
          <Progress value={stats.completionRate} className="h-1 mt-2" />
        </Card>
      </div>

      {/* Filters & List */}
      <div className="space-y-4">
        <Tabs value={filter} onValueChange={(v: any) => setFilter(v)}>
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="assigned">
              <AlertCircle className="h-3.5 w-3.5 mr-2" />
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="started">
              <Loader2 className="h-3.5 w-3.5 mr-2" />
              Active ({stats.inProgress})
            </TabsTrigger>
            <TabsTrigger value="completed">
              <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
              Completed ({stats.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {filteredAssignments.length === 0 ? (
            <Card className="p-12 text-center border-border/40">
              <AlertCircle className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No tasks in this category yet.</p>
            </Card>
          ) : (
            filteredAssignments.map((assignment, idx) => {
              const disaster = disasters.find(d => d.id === assignment.disaster_id);
              const team = teams.find(t => t.id === assignment.team_id);
              const duration = getTaskDuration(assignment);

              if (!disaster || !team) return null;

              return (
                <Card
                  key={assignment.id}
                  className={`p-5 space-y-4 border animate-scale-in ${getStatusColor(assignment.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(assignment.status)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{disaster.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs capitalize">
                            {disaster.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {assignment.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="truncate">{disaster.location_label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {team.type === "ngo" ? (
                        <Heart className="h-4 w-4" />
                      ) : (
                        <Building2 className="h-4 w-4" />
                      )}
                      <span className="truncate">{team.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="truncate">
                        Assigned {formatDistanceToNow(new Date(assignment.assigned_at), { addSuffix: true })}
                      </span>
                    </div>
                    {duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span className="truncate">{duration}</span>
                      </div>
                    )}
                  </div>

                  {assignment.notes && (
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/40">
                      <p className="text-sm text-muted-foreground italic">
                        <span className="font-semibold">Notes:</span> {assignment.notes}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-border/20">
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {assignment.assigned_at && (
                        <div>Assigned: {new Date(assignment.assigned_at).toLocaleString()}</div>
                      )}
                      {assignment.started_at && (
                        <div>Started: {new Date(assignment.started_at).toLocaleString()}</div>
                      )}
                      {assignment.completed_at && (
                        <div>Completed: {new Date(assignment.completed_at).toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
