import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useDemo } from "@/lib/demoStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Radio, Sparkles, Shield, Building2, HeartHandshake, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Role } from "@/lib/demoData";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { user, isDemo, signIn, signUp } = useAuth();
  const demo = useDemo();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("ngo");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user || isDemo) navigate({ to: "/dashboard" });
  }, [user, isDemo, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (tab === "login") {
      const { error } = await signIn(email, password);
      if (error) toast.error(error);
      else { toast.success("Welcome back"); navigate({ to: "/dashboard" }); }
    } else {
      const { error } = await signUp(email, password, name || email.split("@")[0], role);
      if (error) toast.error(error);
      else toast.success("Account created — you're in.");
    }
    setBusy(false);
  }

  function startDemo(r: Role) {
    demo.enter(r);
    toast.success(`Demo mode: ${r === "admin" ? "Admin" : r === "ngo" ? "NGO" : "Government"} console`);
    navigate({ to: "/dashboard" });
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden grid lg:grid-cols-2">
      {/* LEFT: Animated mission brief */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 mesh-bg overflow-hidden">
        {/* animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute h-[600px] w-[600px] rounded-full border border-primary/10 animate-pulse-ring" />
          <div className="absolute h-[440px] w-[440px] rounded-full border border-primary/15" />
          <div className="absolute h-[280px] w-[280px] rounded-full border border-primary/20" />
          <div className="absolute h-3 w-3 rounded-full bg-primary glow-primary animate-pulse" />
          {/* satellite dots */}
          {[0, 60, 120, 180, 240, 300].map(deg => (
            <div key={deg}
              className="absolute h-2 w-2 rounded-full bg-primary/70"
              style={{ transform: `rotate(${deg}deg) translate(220px) rotate(-${deg}deg)` }}
            />
          ))}
        </div>

        <div className="relative z-10 flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center glow-primary">
            <Radio className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-bold text-xl leading-none">ReliefSync</div>
            <div className="text-[11px] uppercase tracking-widest text-primary mt-0.5">AI Coordination</div>
          </div>
        </div>

        <div className="relative z-10 max-w-md animate-fade-in-up stagger-2">
          <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1 text-[11px] text-primary mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            COMMAND CHANNEL · ENCRYPTED
          </div>
          <h2 className="text-4xl font-display font-bold leading-tight">
            One <span className="text-gradient">tactical surface</span> for every responder.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Connect command, NGOs and field crews. Assign smart, track live, decide faster.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3 max-w-md animate-fade-in-up stagger-3">
          {[
            { v: "247", l: "Active teams" },
            { v: "12", l: "Live incidents" },
            { v: "98%", l: "Uptime" },
          ].map(s => (
            <div key={s.l} className="glass rounded-xl p-3 hover:glow-primary transition-all duration-300">
              <div className="text-xl font-display font-bold text-primary">{s.v}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Auth card */}
      <div className="flex items-center justify-center p-4 md:p-8 animate-fade-in">
        <div className="w-full max-w-md glass-strong rounded-2xl p-6 animate-scale-in shadow-glow">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center">
              <Radio className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="font-display font-bold">ReliefSync</div>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form className="space-y-3 mt-4 animate-fade-in" onSubmit={handleSubmit}>
                <div>
                  <Label>Email</Label>
                  <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="commander@agency.gov" />
                </div>
                <div>
                  <Label>Password</Label>
                  <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full mt-2" disabled={busy}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Authenticate"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form className="space-y-2 mt-3 animate-fade-in" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} placeholder="J. Verma" className="h-8 text-xs" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-8 text-xs" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Password</Label>
                    <Input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="h-8 text-xs" />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="government">Gov</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full h-8 text-xs" disabled={busy}>
                  {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Create account"}
                </Button>
              </form>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/60" /></div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-[9px] uppercase tracking-widest text-muted-foreground">Demo Mode</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <CompactDemoButton icon={Shield} label="Admin" onClick={() => startDemo("admin")} />
                <CompactDemoButton icon={HeartHandshake} label="NGO" onClick={() => startDemo("ngo")} />
                <CompactDemoButton icon={Building2} label="Gov" onClick={() => startDemo("government")} />
              </div>

              <p className="mt-3 text-[9px] text-muted-foreground text-center">
                Local-only data. Sign in for real-time sync.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-3 text-center">
            <Link to="/" className="text-[10px] text-muted-foreground hover:text-primary">← Back to overview</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompactDemoButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg glass border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group text-center"
    >
      <div className="h-7 w-7 rounded bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary/20 group-hover:glow-primary transition-all">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="text-[10px] font-medium">{label}</div>
    </button>
  );
}


