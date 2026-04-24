import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { StatCard } from "@/components/StatCard";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid
} from "recharts";
import { useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Activity, Clock, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/_app/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { effectiveRole } = useAuth();
  const navigate = useNavigate();
  const { disasters, teams, assignments, loading } = useTacticalData();

  useEffect(() => {
    if (effectiveRole && effectiveRole !== "admin") navigate({ to: "/dashboard" });
  }, [effectiveRole, navigate]);

  const completionRate = useMemo(() => {
    if (assignments.length === 0) return 0;
    return Math.round((assignments.filter(a => a.status === "completed").length / assignments.length) * 100);
  }, [assignments]);

  const avgResponseHrs = useMemo(() => {
    const started = assignments.filter(a => a.started_at);
    if (started.length === 0) return 0;
    const total = started.reduce((sum, a) => sum + (new Date(a.started_at!).getTime() - new Date(a.assigned_at).getTime()), 0);
    return +(total / started.length / 3600000).toFixed(1);
  }, [assignments]);

  const teamUtilization = useMemo(() => {
    const total = teams.length || 1;
    return Math.round((teams.filter(t => t.availability_status === "busy").length / total) * 100);
  }, [teams]);

  const statusData = [
    { name: "Pending", value: disasters.filter(d => d.status === "pending").length, color: "hsl(45 90% 60%)" },
    { name: "In Progress", value: disasters.filter(d => d.status === "in_progress").length, color: "hsl(195 80% 60%)" },
    { name: "Completed", value: disasters.filter(d => d.status === "completed").length, color: "hsl(155 70% 55%)" },
  ];

  const teamWorkload = teams.map(t => ({ name: t.name.split(" ")[0], workload: t.workload, type: t.type }));

  // Simulated 7-day response trend
  const trend = Array.from({ length: 7 }, (_, i) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    incidents: 2 + Math.floor(Math.random() * 6),
    completed: 1 + Math.floor(Math.random() * 4),
  }));

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Coordination Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Operational metrics across the response network.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="animate-stagger-1"><StatCard label="Completion rate" value={`${completionRate}%`} icon={<TrendingUp className="h-5 w-5" />} accent="success" /></div>
        <div className="animate-stagger-2"><StatCard label="Avg response time" value={`${avgResponseHrs}h`} icon={<Clock className="h-5 w-5" />} accent="primary" /></div>
        <div className="animate-stagger-3"><StatCard label="Team utilization" value={`${teamUtilization}%`} icon={<Users className="h-5 w-5" />} accent="warning" /></div>
        <div className="animate-stagger-4"><StatCard label="Total operations" value={assignments.length} icon={<Activity className="h-5 w-5" />} accent="primary" /></div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-5 animate-scale-in stagger-2">
          <h2 className="font-display font-semibold mb-4">Incident Status Distribution</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip 
                  contentStyle={{ background: "oklch(0.18 0.025 235)", border: "1px solid oklch(0.78 0.15 195 / 0.3)", borderRadius: "8px" }} 
                  itemStyle={{ color: "oklch(0.96 0.01 200)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-xl p-5 animate-scale-in stagger-3">
          <h2 className="font-display font-semibold mb-4">Team Workload</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamWorkload}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 235)" />
                <XAxis dataKey="name" stroke="oklch(0.6 0.03 220)" fontSize={11} />
                <YAxis stroke="oklch(0.6 0.03 220)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ background: "oklch(0.18 0.025 235)", border: "1px solid oklch(0.78 0.15 195 / 0.3)", borderRadius: "8px" }} 
                  itemStyle={{ color: "oklch(0.96 0.01 200)" }}
                  labelStyle={{ color: "oklch(0.96 0.01 200)", fontWeight: "bold", marginBottom: "4px" }}
                />
                <Bar dataKey="workload" fill="oklch(0.78 0.15 195)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass rounded-xl p-5 animate-scale-in stagger-4">
        <h2 className="font-display font-semibold mb-4">7-day response trend</h2>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.03 235)" />
              <XAxis dataKey="day" stroke="oklch(0.6 0.03 220)" fontSize={11} />
              <YAxis stroke="oklch(0.6 0.03 220)" fontSize={11} />
              <Tooltip 
                contentStyle={{ background: "oklch(0.18 0.025 235)", border: "1px solid oklch(0.78 0.15 195 / 0.3)", borderRadius: "8px" }} 
                itemStyle={{ color: "oklch(0.96 0.01 200)" }}
                labelStyle={{ color: "oklch(0.96 0.01 200)", fontWeight: "bold", marginBottom: "4px" }}
              />
              <Legend />
              <Line type="monotone" dataKey="incidents" stroke="oklch(0.78 0.16 75)" strokeWidth={2} />
              <Line type="monotone" dataKey="completed" stroke="oklch(0.72 0.18 155)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
