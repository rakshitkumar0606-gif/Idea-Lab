import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import {
  DEMO_TEAMS, DEMO_DISASTERS, DEMO_ASSIGNMENTS, DEMO_RESOURCES, DEMO_MESSAGES, DEMO_FUNDS, DEMO_TRANSACTIONS,
  type DemoTeam, type DemoDisaster, type DemoAssignment, type DemoResource, type DemoMessage, type Role,
  type DemoFund, type DemoFundTransaction
} from "./demoData";

const KEY = "reliefsync.demo.session";

export type DemoSession = { active: true; role: Role; name: string } | null;

type DemoStoreValue = {
  session: DemoSession;
  enter: (role: Role) => void;
  exit: () => void;
  teams: DemoTeam[];
  disasters: DemoDisaster[];
  assignments: DemoAssignment[];
  resources: DemoResource[];
  messages: DemoMessage[];
  funds: DemoFund[];
  transactions: DemoFundTransaction[];
  assignTeam: (disasterId: string, teamId: string) => Promise<void>;
  updateAssignmentStatus: (assignmentId: string, status: "assigned" | "started" | "completed") => Promise<void>;
  sendMessage: (body: string, isBroadcast?: boolean) => Promise<void>;
  addDisaster: (d: Omit<DemoDisaster, "id" | "created_at" | "status">) => Promise<void>;
  allocateFunds: (disasterId: string, amount: number, description: string) => Promise<void>;
  updateFundUsage: (disasterId: string, amount: number, description: string) => Promise<void>;
};

const Ctx = createContext<DemoStoreValue | null>(null);

function loadSession(): DemoSession {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession>(() => loadSession());
  const [teams, setTeams] = useState<DemoTeam[]>(DEMO_TEAMS);
  const [disasters, setDisasters] = useState<DemoDisaster[]>(DEMO_DISASTERS);
  const [assignments, setAssignments] = useState<DemoAssignment[]>(DEMO_ASSIGNMENTS);
  const [resources] = useState<DemoResource[]>(DEMO_RESOURCES);
  const [messages, setMessages] = useState<DemoMessage[]>(DEMO_MESSAGES);
  const [funds, setFunds] = useState<DemoFund[]>(DEMO_FUNDS);
  const [transactions, setTransactions] = useState<DemoFundTransaction[]>(DEMO_TRANSACTIONS);

  const enter = useCallback((role: Role) => {
    const name =
      role === "admin" ? "Demo Admin" :
      role === "ngo" ? "Demo NGO Lead" : "Demo Govt Officer";
    const s: DemoSession = { active: true, role, name };
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  }, []);

  const exit = useCallback(() => {
    localStorage.removeItem(KEY);
    setSession(null);
  }, []);

  const assignTeam = useCallback(async (disasterId: string, teamId: string) => {
    const exists = assignments.some(a => a.disaster_id === disasterId && a.team_id === teamId && a.status !== "completed");
    if (exists) return;

    const disaster = disasters.find(d => d.id === disasterId);
    const team = teams.find(t => t.id === teamId);
    if (!disaster || !team) return;

    const newA: DemoAssignment = {
      id: `a-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      disaster_id: disasterId, team_id: teamId, status: "assigned", notes: "",
      assigned_at: new Date().toISOString(),
    };

    setAssignments(prev => [...prev, newA]);
    setDisasters(prev => prev.map(d => d.id === disasterId && d.status === "pending" ? { ...d, status: "in_progress" } : d));
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, workload: t.workload + 1, availability_status: t.workload + 1 >= 3 ? "busy" : t.availability_status } : t));
    
    // Automatic system notification
    setMessages(prev => [...prev, {
      id: `m-auto-${Date.now()}`,
      sender: "Central Command",
      sender_role: "admin",
      body: `🚨 MISSION ASSIGNED: ${team.name} deployed to ${disaster.title}.`,
      is_broadcast: true,
      created_at: new Date().toISOString(),
    }]);
  }, [assignments, disasters, teams]);

  const updateAssignmentStatus = useCallback(async (id: string, status: "assigned" | "started" | "completed") => {
    setAssignments(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a, status,
        started_at: status === "started" && !a.started_at ? new Date().toISOString() : a.started_at,
        completed_at: status === "completed" ? new Date().toISOString() : a.completed_at,
      };
    }));
    if (status === "completed") {
      const assignment = assignments.find(a => a.id === id);
      if (assignment) {
        const team = teams.find(t => t.id === assignment.team_id);
        const disaster = disasters.find(d => d.id === assignment.disaster_id);

        if (team && disaster) {
          setMessages(prev => [...prev, {
            id: `m-comp-${Date.now()}`,
            sender: "Central Command",
            sender_role: "admin",
            body: `✅ MISSION COMPLETED: ${team.name} has finished operations at ${disaster.title}.`,
            is_broadcast: true,
            created_at: new Date().toISOString(),
          }]);
        }

        // mark disaster completed if all assignments done
        const remaining = assignments.filter(a => a.disaster_id === assignment.disaster_id && a.id !== id && a.status !== "completed");
        if (remaining.length === 0) {
          setDisasters(prev => prev.map(d => d.id === assignment.disaster_id ? { ...d, status: "completed" } : d));
        }
      }
    }
  }, [assignments, disasters, teams]);

  const sendMessage = useCallback(async (body: string, isBroadcast = false) => {
    if (!session) return;
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`,
      sender: session.name, sender_role: session.role,
      body, is_broadcast: isBroadcast, created_at: new Date().toISOString(),
    }]);
  }, [session]);

  const addDisaster = useCallback(async (d: Omit<DemoDisaster, "id" | "created_at" | "status">) => {
    setDisasters(prev => [{ ...d, id: `d-${Date.now()}`, created_at: new Date().toISOString(), status: "pending" }, ...prev]);
  }, []);

  const allocateFunds = useCallback(async (disasterId: string, amount: number, description: string) => {
    setFunds(prev => {
      const exists = prev.find(f => f.disaster_id === disasterId);
      if (exists) {
        return prev.map(f => f.disaster_id === disasterId ? { ...f, allocated_amount: f.allocated_amount + amount, updated_at: new Date().toISOString() } : f);
      }
      return [...prev, { id: `f-${Date.now()}`, disaster_id: disasterId, allocated_amount: amount, used_amount: 0, updated_at: new Date().toISOString() }];
    });
    setTransactions(prev => [{
      id: `ft-${Date.now()}`, disaster_id: disasterId, amount, type: "allocated", description, created_at: new Date().toISOString()
    }, ...prev]);

    // Notification
    const d = disasters.find(x => x.id === disasterId);
    if (d) {
      setMessages(prev => [...prev, {
        id: `m-fund-${Date.now()}`, sender: "Treasury", sender_role: "admin",
        body: `💰 FUNDS ALLOCATED: ₹${amount.toLocaleString()} added to ${d.title}.`,
        is_broadcast: true, created_at: new Date().toISOString()
      }]);
    }
  }, [disasters]);

  const updateFundUsage = useCallback(async (disasterId: string, amount: number, description: string) => {
    setFunds(prev => prev.map(f => f.disaster_id === disasterId ? { ...f, used_amount: f.used_amount + amount, updated_at: new Date().toISOString() } : f));
    setTransactions(prev => [{
      id: `ft-${Date.now()}`, disaster_id: disasterId, amount, type: "used", description, created_at: new Date().toISOString()
    }, ...prev]);

    // Notification
    const d = disasters.find(x => x.id === disasterId);
    if (d) {
      setMessages(prev => [...prev, {
        id: `m-usage-${Date.now()}`, sender: "Field Ops", sender_role: "ngo",
        body: `📉 FUND USAGE: ₹${amount.toLocaleString()} spent for ${description} at ${d.title}.`,
        is_broadcast: false, created_at: new Date().toISOString()
      }]);
    }
  }, [disasters]);

  return (
    <Ctx.Provider value={{
      session, enter, exit, teams, disasters, assignments, resources, messages, funds, transactions,
      assignTeam, updateAssignmentStatus, sendMessage, addDisaster, allocateFunds, updateFundUsage
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDemo() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemo must be used within DemoStoreProvider");
  return v;
}
