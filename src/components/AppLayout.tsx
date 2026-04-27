import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { NewsBanner } from "./NewsBanner";
import { NotificationsPanel } from "./NotificationsPanel";
import { useAuth } from "@/lib/auth";
import { useDemo } from "@/lib/demoStore";
import { useNotifications } from "@/lib/notificationContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Map, ListChecks, BarChart3, MessagesSquare, Users, LogOut, Radio, Sparkles, Boxes, IndianRupee, Bell
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import type { ReactNode } from "react";

const adminNav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/map", label: "Coordination Map", icon: Map },
  { to: "/assignments", label: "Assignments", icon: Users },
  { to: "/task-tracking", label: "Task Tracking", icon: ListChecks },
  { to: "/team-management", label: "Team Management", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/chat", label: "Communications", icon: MessagesSquare },
  { to: "/resources", label: "Resources", icon: Boxes },
  { to: "/funds", label: "Funds", icon: IndianRupee },
];

const teamNav = [
  { to: "/dashboard", label: "My Tasks", icon: LayoutDashboard },
  { to: "/map", label: "Map", icon: Map },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/chat", label: "Communications", icon: MessagesSquare },
  { to: "/resources", label: "Resources", icon: Boxes },
  { to: "/funds", label: "Funds", icon: IndianRupee },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const { effectiveRole, effectiveName, isDemo, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const demo = useDemo();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const nav = effectiveRole === "admin" ? adminNav : teamNav;

  async function handleSignOut() {
    await signOut();
    if (isDemo) demo.exit();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  }

  const roleLabel =
    effectiveRole === "admin" ? "Central Authority" :
      effectiveRole === "ngo" ? "NGO Team" : "Government Team";

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col glass-strong border-r border-border/40">
        <div className="p-6 border-b border-border/40">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center glow-primary">
              <Radio className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">ReliefSync</div>
              <div className="text-[10px] uppercase tracking-widest text-primary mt-1">AI Coordination</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-hidden">
          {nav.map(item => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-300 animate-slide-in-right stagger-${(nav.indexOf(item) % 5) + 1} relative overflow-hidden group ${active
                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_20px_rgba(var(--primary-rgb),0.2)] backdrop-blur-md"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground hover:translate-x-1"
                  }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent animate-shimmer" />
                )}
                <Icon className={`h-4 w-4 relative z-10 ${active ? "animate-pulse" : "group-hover:scale-110 transition-transform"}`} />
                <span className="font-medium relative z-10">{item.label}</span>
                {active && (
                  <span className="ml-auto relative z-10 h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/40">
          <div className="glass rounded-lg p-3 mb-2">
            <div className="text-xs text-muted-foreground">Signed in as</div>
            <div className="text-sm font-medium truncate">{effectiveName}</div>
            <div className="text-[10px] uppercase tracking-wider text-primary mt-0.5">{roleLabel}</div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {isDemo && (
          <div className="bg-warning/15 border-b border-warning/30 text-warning px-4 py-2 text-xs flex items-center justify-center gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium tracking-wide uppercase">Demo Mode Active</span>
            <span className="text-warning/80">— exploring as {roleLabel}. All changes are local.</span>
          </div>
        )}
        <header className="h-14 border-b border-border/40 glass-strong flex items-center justify-between px-6">
          <div className="font-display text-sm text-muted-foreground">
            <span className="text-primary">●</span> Live operations dashboard
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="relative"
              onClick={() => setNotificationsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <div className="md:hidden flex gap-1">
              {nav.slice(0, 4).map(n => (
                <Link key={n.to} to={n.to} className="p-2 rounded-md hover:bg-muted/50">
                  <n.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </header>
        <NewsBanner />
        <main className="flex-1 overflow-auto p-6 animate-fade-in">
          {children}
        </main>
      </div>
      
      <NotificationsPanel open={notificationsOpen} onOpenChange={setNotificationsOpen} />
    </div>
  );
}
