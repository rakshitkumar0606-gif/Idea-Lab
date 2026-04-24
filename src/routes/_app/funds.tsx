import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useAuth } from "../../lib/auth";
import { useTacticalData, type CoordinationData } from "../../lib/useTacticalData";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { 
  Wallet, TrendingUp, History, PieChart as PieChartIcon, 
  Plus, ArrowUpRight, ArrowDownRight, IndianRupee, MapPin, 
  Calendar, CheckCircle2, AlertTriangle, Info, Users
} from "lucide-react";
import { format } from "date-fns";
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, PieChart, Pie, Cell 
} from "recharts";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/funds")({
  component: FundsPage,
});

function FundsPage() {
  const { effectiveRole } = useAuth();
  const { 
    disasters, teams, funds, transactions, allocateFunds, updateFundUsage 
  }: CoordinationData = useTacticalData();
  const [isAllocating, setIsAllocating] = useState(false);
  const [isUpdatingUsage, setIsUpdatingUsage] = useState(false);

  const [selectedDisasterId, setSelectedDisasterId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const isAdmin = effectiveRole === "admin";

  // Calculations
  const stats = useMemo(() => {
    const totalAllocated = funds.reduce((sum: number, f: any) => sum + f.allocated_amount, 0);
    const totalUsed = funds.reduce((sum: number, f: any) => sum + f.used_amount, 0);
    const available = totalAllocated - totalUsed;
    return { totalAllocated, totalUsed, available };
  }, [funds]);

  const chartData = useMemo(() => {
    return funds.map((f: any) => {
      const d = disasters.find((x: any) => x.id === f.disaster_id);
      return {
        name: d?.title.split(" ")[0] || "Unknown",
        allocated: f.allocated_amount,
        used: f.used_amount,
        remaining: f.allocated_amount - f.used_amount
      };
    });
  }, [funds, disasters]);

  const pieData = [
    { name: "Used", value: stats.totalUsed, color: "oklch(0.65 0.22 25)" },
    { name: "Remaining", value: stats.available, color: "oklch(0.78 0.15 195)" }
  ];

  const handleAllocate = async () => {
    if (!selectedDisasterId || !amount) return;
    try {
      await allocateFunds(selectedDisasterId, Number(amount), description);
      toast.success("Funds Allocated Successfully");
      setIsAllocating(false);
      setAmount("");
    } catch (err: any) {
      toast.error("Failed to allocate funds");
    }
  };

  const handleUpdateUsage = async () => {
    if (!selectedDisasterId || !amount) return;
    try {
      await updateFundUsage(selectedDisasterId, Number(amount), description);
      toast.success("Usage Recorded Successfully");
      setIsUpdatingUsage(false);
      setAmount("");
      setDescription("");
    } catch (err: any) {
      toast.error("Failed to update usage");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-display font-bold">Funds Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Transparent financial tracking for disaster relief.</p>
        </div>
        <div className="flex gap-3">
          {isAdmin ? (
            <Button onClick={() => setIsAllocating(true)} className="gap-2 glow-primary">
              <Plus className="h-4 w-4" /> Allocate Funds
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsUpdatingUsage(true)} className="gap-2 border-primary/30">
              <Plus className="h-4 w-4 text-primary" /> Log Expenditure
            </Button>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Budget" value={stats.totalAllocated} icon={Wallet} color="text-primary" />
        <StatCard title="Total Utilized" value={stats.totalUsed} icon={TrendingUp} color="text-warning" />
        <StatCard title="Remaining Balance" value={stats.available} icon={IndianRupee} color="text-success" />
        <StatCard title="Usage Rate" value={`${((stats.totalUsed / stats.totalAllocated) * 100 || 0).toFixed(1)}%`} icon={PieChartIcon} color="text-destructive" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Disaster-wise breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> Disaster-wise Allocation
          </h2>
          <div className="grid gap-3">
            {funds.map((f: any, i: number) => {
              const d = disasters.find((x: any) => x.id === f.disaster_id);
              if (!d) return null;
              const usedPercent = (f.used_amount / f.allocated_amount) * 100;
              const isLow = usedPercent > 80;
              return (
                <div key={f.id} className="glass p-4 rounded-xl space-y-4 animate-slide-in-right stagger-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-lg">{d.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {d.location_label}
                      </div>
                    </div>
                    <Badge 
                      className={`gap-1 px-3 ${isLow ? "bg-destructive/20 text-destructive border-destructive/30" : usedPercent > 50 ? "bg-warning/20 text-warning border-warning/30" : "bg-success/20 text-success border-success/30"}`}
                    >
                      {isLow ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                      {isLow ? "Critical" : usedPercent > 50 ? "Moderate" : "Healthy"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 py-2 border-y border-border/40">
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground">Allocated</div>
                      <div className="font-display font-bold">₹{f.allocated_amount.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase text-muted-foreground">Used</div>
                      <div className="font-display font-bold text-warning">₹{f.used_amount.toLocaleString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase text-muted-foreground">Remaining</div>
                      <div className="font-display font-bold text-success">₹{(f.allocated_amount - f.used_amount).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Usage Progress</span>
                      <span>{usedPercent.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden border border-border/40">
                      <div 
                        className={`h-full transition-all duration-1000 ${isLow ? "bg-destructive" : usedPercent > 50 ? "bg-warning" : "bg-primary"}`}
                        style={{ width: `${Math.min(usedPercent, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Analytics Side */}
        <div className="space-y-6">
          <div className="glass p-5 rounded-xl animate-scale-in">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Budget Distribution
            </h3>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(10, 15, 25, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                    formatter={(v: number) => `₹${v.toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 text-xs">
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> Remaining</div>
              <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-destructive" /> Utilized</div>
            </div>
          </div>

          <div className="glass p-5 rounded-xl animate-scale-in stagger-2">
            <h3 className="text-sm font-semibold mb-4">Allocation Analytics</h3>
            <div className="h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "rgba(10, 15, 25, 0.9)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "12px" }}
                    formatter={(v: number) => `₹${v.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="allocated" stroke="oklch(0.78 0.15 195)" fill="oklch(0.78 0.15 195 / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Log */}
      <div className="glass rounded-xl overflow-hidden animate-fade-in stagger-3">
        <div className="p-4 border-b border-border/40 bg-muted/20 flex items-center justify-between">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Transaction Ledger
          </h2>
          <Badge variant="outline" className="border-primary/20">{transactions.length} items</Badge>
        </div>
        <div className="max-h-[400px] overflow-auto scrollbar-thin">
          <table className="w-full text-left border-collapse">
            <thead className="text-[10px] uppercase tracking-widest text-muted-foreground bg-muted/10 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="p-4 font-medium border-b border-border/40">Date</th>
                <th className="p-4 font-medium border-b border-border/40">Disaster</th>
                <th className="p-4 font-medium border-b border-border/40">Amount</th>
                <th className="p-4 font-medium border-b border-border/40">Type</th>
                <th className="p-4 font-medium border-b border-border/40">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-sm">
              {transactions.map((t: any) => {
                const d = disasters.find((x: any) => x.id === t.disaster_id);
                return (
                  <tr key={t.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-4 text-muted-foreground whitespace-nowrap">
                      <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {format(new Date(t.created_at), "MMM d, HH:mm")}</div>
                    </td>
                    <td className="p-4 font-medium">{d?.title || "Unknown"}</td>
                    <td className="p-4 font-display font-bold">₹{t.amount.toLocaleString()}</td>
                    <td className="p-4">
                      {t.type === "allocated" ? (
                        <Badge className="bg-success/10 text-success border-success/40 gap-1"><ArrowUpRight className="h-3 w-3" /> Allocated</Badge>
                      ) : (
                        <Badge className="bg-warning/10 text-warning border-warning/40 gap-1"><ArrowDownRight className="h-3 w-3" /> Used</Badge>
                      )}
                    </td>
                    <td className="p-4 text-muted-foreground truncate max-w-xs">{t.description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocation Modal */}
      {(isAllocating || isUpdatingUsage) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={() => { setIsAllocating(false); setIsUpdatingUsage(false); }} />
          <div className="relative w-full max-w-md glass-strong p-6 rounded-2xl shadow-2xl animate-scale-in">
            <h2 className="text-2xl font-display font-bold mb-4 flex items-center gap-2">
              {isAllocating ? <IndianRupee className="text-primary h-6 w-6" /> : <TrendingUp className="text-warning h-6 w-6" />}
              {isAllocating ? "Allocate Disaster Funds" : "Log Operational Expense"}
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Target Incident</label>
                <select 
                  value={selectedDisasterId} 
                  onChange={(e) => setSelectedDisasterId(e.target.value)}
                  className="w-full bg-muted/40 border border-border/40 rounded-lg p-2.5 text-sm outline-none focus:border-primary/50 transition-all"
                >
                  <option value="" disabled className="bg-background">Select disaster...</option>
                  {disasters.map((d: any) => (
                    <option key={d.id} value={d.id} className="bg-background">{d.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Amount (INR)</label>
                <Input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="e.g. 50000"
                  className="bg-muted/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground">Operational Details</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder={isAllocating ? "Reason for allocation..." : "What was this spent on?"}
                  className="w-full bg-muted/40 border border-border/40 rounded-lg p-3 text-sm outline-none focus:border-primary/50 transition-all min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => { setIsAllocating(false); setIsUpdatingUsage(false); }}>Cancel</Button>
                <Button className="flex-1 glow-primary" onClick={isAllocating ? handleAllocate : handleUpdateUsage}>
                  {isAllocating ? "Execute Allocation" : "Submit Expense"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="glass p-5 rounded-xl border-l-4 border-l-primary/30 animate-scale-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{title}</span>
        <div className={`p-2 rounded-lg bg-muted/30 ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        {typeof value === "number" && <span className="text-xs text-muted-foreground font-display">₹</span>}
        <span className="text-2xl font-display font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
      </div>
    </div>
  );
}
