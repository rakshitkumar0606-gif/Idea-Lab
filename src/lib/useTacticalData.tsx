// Unified data hook — returns demo data if in demo mode, otherwise live Supabase data.
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./auth";
import { useDemo } from "./demoStore";
import type {
  DemoTeam, DemoDisaster, DemoAssignment, DemoResource, DemoMessage,
  DemoFund, DemoFundTransaction
} from "./demoData";
import { toast } from "sonner";
import { Zap } from "lucide-react";

export type TaskCompletionReport = {
  resourceType: string;
  resourceUsed: number;
  completionNotes: string;
};

export type CoordinationData = {
  loading: boolean;
  teams: DemoTeam[];
  disasters: DemoDisaster[];
  assignments: DemoAssignment[];
  resources: DemoResource[];
  messages: DemoMessage[];
  funds: DemoFund[];
  transactions: DemoFundTransaction[];
  assignTeam: (disasterId: string, teamId: string) => Promise<void>;
  updateAssignmentStatus: (id: string, status: "assigned" | "started" | "completed") => Promise<void>;
  completeAssignmentWithReport: (id: string, report: TaskCompletionReport) => Promise<void>;
  sendMessage: (body: string, isBroadcast?: boolean) => Promise<void>;
  allocateFunds: (disasterId: string, amount: number, description: string) => Promise<void>;
  updateFundUsage: (disasterId: string, amount: number, description: string) => Promise<void>;
};

function sortAssignmentsByNewest<T extends { assigned_at: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.assigned_at).getTime() - new Date(a.assigned_at).getTime(),
  );
}

function distKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export function useTacticalData(): CoordinationData {
  const { isDemo, effectiveRole, profile } = useAuth();
  const demo = useDemo();

  const [liveTeams, setLiveTeams] = useState<DemoTeam[]>([]);
  const [liveDisasters, setLiveDisasters] = useState<DemoDisaster[]>([]);
  const [liveAssignments, setLiveAssignments] = useState<DemoAssignment[]>([]);
  const [liveResources, setLiveResources] = useState<DemoResource[]>([]);
  const [liveMessages, setLiveMessages] = useState<DemoMessage[]>([]);
  const [liveFunds, setLiveFunds] = useState<DemoFund[]>([]);
  const [liveTransactions, setLiveTransactions] = useState<DemoFundTransaction[]>([]);
  const [loading, setLoading] = useState(!isDemo);

  useEffect(() => {
    if (isDemo) { setLoading(false); return; }
    // If not admin, we need the profile to know the team_id before subscribing
    if (effectiveRole && effectiveRole !== "admin" && !profile) return;

    let active = true;
    const teamId = profile?.team_id;
    const isAdmin = effectiveRole === "admin";

    (async () => {
      setLoading(true);
      // Construct queries based on scope
      let teamQuery = supabase.from("teams").select("*").order("name");
      let disasterQuery = supabase.from("disasters").select("*").order("created_at", { ascending: false });
      let assignmentQuery = supabase.from("assignments").select("*").order("assigned_at", { ascending: false });
      let messageQuery = supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(100);

      if (!isAdmin && teamId) {
        assignmentQuery = assignmentQuery.eq("team_id", teamId);
        // Only show messages that are broadcasts OR for the user's team
        messageQuery = messageQuery.or(`is_broadcast.eq.true,team_id.eq.${teamId}`);
        // Optionally filter teams to just their own, but usually teams need to see each other on map
      }

      const [t, d, a, r, m, f, tr] = await Promise.all([
        teamQuery,
        disasterQuery,
        assignmentQuery,
        supabase.from("resources").select("*"),
        messageQuery,
        (supabase as any).from("funds").select("*"),
        (supabase as any).from("fund_transactions").select("*").order("created_at", { ascending: false }),
      ]);

      if (!active) return;
      setLiveTeams((t.data as any) ?? []);
      setLiveDisasters((d.data as any) ?? []);
      setLiveAssignments((a.data as any) ?? []);
      setLiveResources((r.data as any) ?? []);
      setLiveFunds((f.data as any) ?? []);
      setLiveTransactions((tr.data as any) ?? []);
      setLiveMessages(((m.data as any) ?? []).map((row: any) => ({
        id: row.id, sender: row.sender_id?.slice(0, 8) ?? "user", sender_role: "ngo" as const,
        body: row.body, is_broadcast: row.is_broadcast, created_at: row.created_at,
      })));
      setLoading(false);
    })();

    function applyChange<T extends { id: string }>(
      setter: Dispatch<SetStateAction<T[]>>,
      payload: any,
    ) {
      const { eventType, new: newRow, old: oldRow, table } = payload;
      
      // Trigger toast for assignment updates - only if we have both states
      if (table === "assignments" && eventType === "UPDATE" && newRow && oldRow && newRow.status !== oldRow.status) {
        toast.info(`Mission Update: Status changed to ${newRow.status}`, {
          description: "Tactical data synchronized in realtime.",
          icon: <Zap className="h-4 w-4 text-primary" />,
        });
      }

      setter(prev => {
        if (eventType === "INSERT" && newRow) {
          if (prev.some(r => r.id === newRow.id)) return prev;
          return [newRow as T, ...prev];
        }
        if (eventType === "UPDATE" && newRow) {
          return prev.map(r => (r.id === newRow.id ? { ...r, ...newRow } as T : r));
        }
        if (eventType === "DELETE" && oldRow) {
          return prev.filter(r => r.id !== oldRow.id);
        }
        return prev;
      });
    }

    // Scoped Realtime Channels
    // We append a random string to the topic to avoid "already joined" errors 
    // when React StrictMode quickly unmounts/remounts the component.
    const topic = `coordination-${isAdmin ? "all" : teamId || "public"}-${Math.random().toString(36).slice(2, 10)}`;
    const ch = supabase.channel(topic);

    // Disasters: everyone sees these
    ch.on("postgres_changes", { event: "*", schema: "public", table: "disasters" },
      (payload: any) => applyChange(setLiveDisasters, payload));

    // Assignments: scoped if not admin
    const assignmentOptions: any = { event: "*", schema: "public", table: "assignments" };
    if (!isAdmin && teamId) assignmentOptions.filter = `team_id=eq.${teamId}`;
    ch.on("postgres_changes", assignmentOptions, (payload: any) => applyChange(setLiveAssignments, payload));

    ch.on("postgres_changes", { event: "*", schema: "public", table: "teams" },
      (payload: any) => applyChange(setLiveTeams, payload));
    ch.on("postgres_changes", { event: "*", schema: "public", table: "resources" },
      (payload: any) => applyChange(setLiveResources, payload));

    // Funds & Transactions
    ch.on("postgres_changes", { event: "*", schema: "public", table: "funds" } as any,
      (payload: any) => applyChange(setLiveFunds, payload));
    ch.on("postgres_changes", { event: "*", schema: "public", table: "fund_transactions" } as any,
      (payload: any) => applyChange(setLiveTransactions, payload));

    // Messages: scoped if not admin
    const messageOptions: any = { event: "INSERT", schema: "public", table: "messages" };
    // Note: Complex filters like OR aren't supported in standard real-time filters yet, 
    // so for messages we might still listen to all or rely on RLS.
    // However, we'll implement the simple filter if possible.
    ch.on("postgres_changes", messageOptions, (payload: any) => {
      const { eventType, new: row } = payload;
      if (eventType === "INSERT") {
        // Double check relevance in JS if RLS isn't strictly enforced or for extra safety
        if (!isAdmin && teamId && !row.is_broadcast && row.team_id !== teamId) return;

        setLiveMessages(prev => {
          if (prev.some(m => m.id === row.id)) return prev;
          return [...prev, {
            id: row.id, sender: row.sender_id?.slice(0, 8) ?? "user", sender_role: "ngo" as const,
            body: row.body, is_broadcast: row.is_broadcast, created_at: row.created_at,
          }];
        });
      }
    });

    ch.subscribe();

    return () => { active = false; supabase.removeChannel(ch); };
  }, [isDemo, effectiveRole, profile?.team_id]);

  if (isDemo) {
    return {
      loading: false,
      teams: demo.teams, disasters: demo.disasters, assignments: sortAssignmentsByNewest(demo.assignments),
      resources: demo.resources, messages: demo.messages, funds: demo.funds, transactions: demo.transactions,
      assignTeam: demo.assignTeam,
      updateAssignmentStatus: demo.updateAssignmentStatus,
      completeAssignmentWithReport: demo.completeAssignmentWithReport,
      sendMessage: demo.sendMessage,
      allocateFunds: demo.allocateFunds,
      updateFundUsage: demo.updateFundUsage,
    };
  }
  return {
    loading,
    teams: liveTeams, disasters: liveDisasters, assignments: sortAssignmentsByNewest(liveAssignments),
    resources: liveResources, messages: liveMessages, funds: liveFunds, transactions: liveTransactions,
    assignTeam: async (disasterId: string, teamId: string) => {
      // Insert assignment
      const { data: assignment } = await supabase.from("assignments").insert({ disaster_id: disasterId, team_id: teamId }).select().single();
      
      // Update disaster status
      await supabase.from("disasters").update({ status: "in_progress" }).eq("id", disasterId).eq("status", "pending");
      
      // Get team members for notification
      const { data: teamMembers } = await supabase
        .from("profiles")
        .select("id")
        .eq("team_id", teamId);
      
      // Get disaster info
      const { data: disaster } = await supabase
        .from("disasters")
        .select("title, location_label, severity")
        .eq("id", disasterId)
        .single();
      
      // Get team info
      const { data: team } = await supabase
        .from("teams")
        .select("name")
        .eq("id", teamId)
        .single();

      // Send notifications to all team members
      if (teamMembers && disaster && team) {
        const notificationTitle = `New Task Assignment: ${disaster.title}`;
        const notificationBody = `${team.name} has been assigned to ${disaster.title} at ${disaster.location_label} (${disaster.severity} severity)`;
        
        const notificationInserts = teamMembers.map(member => ({
          user_id: member.id,
          title: notificationTitle,
          body: notificationBody,
          type: "assignment",
          related_id: assignment?.id,
        }));
        
        if (notificationInserts.length > 0) {
          await supabase.from("notifications").insert(notificationInserts);
        }
      }
    },
    updateAssignmentStatus: async (id: string, status: "assigned" | "started" | "completed") => {
      const patch: any = { status };
      if (status === "started") patch.started_at = new Date().toISOString();
      if (status === "completed") patch.completed_at = new Date().toISOString();
      
      // Update assignment
      const { data: assignment } = await supabase.from("assignments").update(patch).eq("id", id).select().single();
      
      // If completed, notify admin and send update notification
      if (status === "completed" && assignment) {
        // Get disaster and team info
        const { data: disaster } = await supabase
          .from("disasters")
          .select("title, created_by")
          .eq("id", assignment.disaster_id)
          .single();
        
        const { data: team } = await supabase
          .from("teams")
          .select("name")
          .eq("id", assignment.team_id)
          .single();
        
        // Notify admin about completion
        if (disaster?.created_by) {
          await supabase.from("notifications").insert({
            user_id: disaster.created_by,
            title: `Task Completed: ${disaster.title}`,
            body: `${team?.name || "Team"} has completed the task for ${disaster.title}`,
            type: "update",
            related_id: id,
          });
        }
      }
      
      if (status === "started" && assignment) {
        // Notify admin that task has started
        const { data: disaster } = await supabase
          .from("disasters")
          .select("title, created_by")
          .eq("id", assignment.disaster_id)
          .single();
        
        const { data: team } = await supabase
          .from("teams")
          .select("name")
          .eq("id", assignment.team_id)
          .single();
        
        if (disaster?.created_by) {
          await supabase.from("notifications").insert({
            user_id: disaster.created_by,
            title: `Task Started: ${disaster.title}`,
            body: `${team?.name || "Team"} has started working on ${disaster.title}`,
            type: "update",
            related_id: id,
          });
        }
      }
    },
    completeAssignmentWithReport: async (id: string, report: TaskCompletionReport) => {
      const { data: assignment } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", id)
        .single();
      if (!assignment) return;

      const reportText = [
        `Completion Report (${new Date().toLocaleString()}):`,
        `Resource used: ${report.resourceUsed} ${report.resourceType}`,
        `Notes: ${report.completionNotes || "N/A"}`,
      ].join("\n");
      const mergedNotes = [assignment.notes?.trim(), reportText].filter(Boolean).join("\n\n");

      await supabase
        .from("assignments")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          notes: mergedNotes,
        })
        .eq("id", id);

      const { data: disaster } = await supabase
        .from("disasters")
        .select("id, title, lat, lng, created_by")
        .eq("id", assignment.disaster_id)
        .single();

      if (disaster && report.resourceUsed > 0) {
        const { data: matchingResources } = await supabase
          .from("resources")
          .select("*")
          .eq("type", report.resourceType);

        const nearest = (matchingResources ?? [])
          .filter((r: any) => r.quantity > 0)
          .sort((a: any, b: any) => distKm(disaster, a) - distKm(disaster, b))[0];

        if (nearest) {
          const nextQty = Math.max(0, Number(nearest.quantity ?? 0) - report.resourceUsed);
          await supabase.from("resources").update({ quantity: nextQty }).eq("id", nearest.id);
        }
      }

      if (disaster?.created_by) {
        await supabase.from("notifications").insert({
          user_id: disaster.created_by,
          title: `Task Completed: ${disaster.title}`,
          body: `Resource used: ${report.resourceUsed} ${report.resourceType}. ${report.completionNotes || "No extra notes."}`,
          type: "update",
          related_id: id,
        } as any);
      }
    },
    sendMessage: async (body: string, isBroadcast = false) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      await supabase.from("messages").insert({ sender_id: u.user.id, body, is_broadcast: isBroadcast });
    },
    allocateFunds: async (disasterId: string, amount: number, description: string) => {
      const { data: current } = await (supabase as any).from("funds").select("*").eq("disaster_id", disasterId).single();
      if (current) {
        await (supabase as any).from("funds").update({ allocated_amount: current.allocated_amount + amount, updated_at: new Date().toISOString() }).eq("disaster_id", disasterId);
      } else {
        await (supabase as any).from("funds").insert({ disaster_id: disasterId, allocated_amount: amount, used_amount: 0 });
      }
      await (supabase as any).from("fund_transactions").insert({ disaster_id: disasterId, amount, type: "allocated", description });
    },
    updateFundUsage: async (disasterId: string, amount: number, description: string) => {
      const { data: current } = await (supabase as any).from("funds").select("*").eq("disaster_id", disasterId).single();
      if (current) {
        await (supabase as any).from("funds").update({ used_amount: current.used_amount + amount, updated_at: new Date().toISOString() }).eq("disaster_id", disasterId);
        await (supabase as any).from("fund_transactions").insert({ disaster_id: disasterId, amount, type: "used", description });
      }
    }
  };
}
