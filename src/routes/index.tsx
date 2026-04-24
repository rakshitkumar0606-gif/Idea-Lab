import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Radio, Map, Users, Activity, Sparkles, ArrowRight, Shield, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, isDemo, effectiveRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user || isDemo) navigate({ to: "/dashboard" });
  }, [user, isDemo, navigate]);

  return (
    <div className="min-h-screen mesh-bg">
      {/* Top nav */}
      <header className="border-b border-border/30 glass-strong">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center glow-primary">
              <Radio className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <div className="font-display font-bold text-lg leading-none">ReliefSync</div>
              <div className="text-[10px] uppercase tracking-widest text-primary mt-0.5">AI Coordination</div>
            </div>
          </div>
          <Link to="/auth"><Button variant="default" size="sm">Sign in</Button></Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20 text-center relative">
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-primary mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          Live operations · 247 teams active · 12 incidents
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.05] max-w-4xl mx-auto">
          Coordinate disaster response <span className="text-gradient">in real time</span>.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
          The unified command surface for government agencies, NGOs and field teams.
          Smart assignment, live tracking, AI-driven decision support.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link to="/auth">
            <Button size="lg" className="gap-2 glow-primary">
              Launch console <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/auth">
            <Button size="lg" variant="outline" className="gap-2 border-primary/40">
              <Sparkles className="h-4 w-4 text-primary" /> Try demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-4">
        {[
          { icon: Map, title: "Coordination Map", desc: "Live disasters, teams and resources on a single tactical map." },
          { icon: Users, title: "Smart Assignment", desc: "AI suggests the best team based on distance, availability, workload." },
          { icon: Activity, title: "Realtime Status", desc: "Field updates flow instantly to command via Supabase Realtime." },
          { icon: Shield, title: "Role-based Access", desc: "Admin, NGO and Government roles with strict RLS policies." },
          { icon: Zap, title: "Decision Support", desc: "Detect duplicate incidents, surface response-time analytics." },
          { icon: Radio, title: "Broadcast & Chat", desc: "Direct comms between command and field teams." },
        ].map((f, i) => (
          <div key={i} className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors">
            <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary flex items-center justify-center mb-4">
              <f.icon className="h-5 w-5" />
            </div>
            <div className="font-display font-semibold">{f.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
