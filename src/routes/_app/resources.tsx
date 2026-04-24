import { createFileRoute } from "@tanstack/react-router";
import { useTacticalData } from "@/lib/useTacticalData";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, AlertCircle, Copy, Boxes } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/_app/resources")({
  component: ResourcesPage,
});

function ResourcesPage() {
  const { resources } = useTacticalData();

  const duplicationStats = useMemo(() => {
    const groups: Record<string, typeof resources> = {};
    resources.forEach(r => {
      const key = `${r.type}-${r.location_label}`.toLowerCase();
      if (!groups[key]) groups[key] = [];
      groups[key].push(r);
    });
    
    return Object.values(groups).filter(g => g.length > 1);
  }, [resources]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Resource Inventory</h1>
        <p className="text-muted-foreground text-sm mt-1">Real-time tracking of stockpiles and logistics.</p>
      </div>

      {duplicationStats.length > 0 && (
        <div className="glass-strong border-warning/30 p-4 rounded-xl flex items-center gap-4 animate-scale-in">
          <div className="h-10 w-10 rounded-full bg-warning/20 flex items-center justify-center border border-warning/40">
            <AlertCircle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <div className="font-bold text-warning flex items-center gap-2">
              Logistics Alert: Duplicate Stocks Found
            </div>
            <p className="text-xs text-muted-foreground">
              {duplicationStats.length} locations have multiple entries for the same resource type. Consider consolidating for better tracking.
            </p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Boxes className="h-5 w-5 text-primary" /> Active Stockpiles
          </h2>
          <div className="grid gap-3">
            {resources.map((r, i) => {
              const isDuplicate = duplicationStats.some(g => g.some(item => item.id === r.id));
              return (
                <div 
                  key={r.id} 
                  className={`glass p-4 rounded-xl flex items-center gap-4 animate-slide-in-right stagger-${(i % 5) + 1} hover:border-primary/40 transition-all group ${isDuplicate ? "border-warning/30 bg-warning/5" : ""}`}
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center border ${isDuplicate ? "bg-warning/20 border-warning/40" : "bg-primary/10 border-primary/30"}`}>
                    <Package className={`h-5 w-5 ${isDuplicate ? "text-warning" : "text-primary"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold truncate">{r.type}</span>
                      {isDuplicate && <Badge variant="outline" className="text-[10px] text-warning border-warning/40 bg-warning/10 gap-1"><Copy className="h-2.5 w-2.5" /> Duplicate</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {r.location_label}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-display font-bold text-primary">{r.quantity.toLocaleString()}</div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Units</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Copy className="h-5 w-5 text-warning" /> Consolidation Insights
          </h2>
          <div className="space-y-3">
            {duplicationStats.map((group, i) => (
              <div key={i} className="glass border-warning/30 p-4 rounded-xl animate-scale-in stagger-2">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
                  <div className="font-bold text-warning">{group[0].type}</div>
                  <Badge variant="outline" className="border-warning/40">{group[0].location_label}</Badge>
                </div>
                <div className="space-y-2">
                  {group.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Entry ID: {item.id}</span>
                      <span className="font-medium">{item.quantity.toLocaleString()} units</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between font-bold">
                    <span>Total Consolidation:</span>
                    <span className="text-primary">{group.reduce((s, x) => s + x.quantity, 0).toLocaleString()} units</span>
                  </div>
                </div>
              </div>
            ))}
            {duplicationStats.length === 0 && (
              <div className="text-center py-20 glass rounded-xl border-dashed">
                <div className="text-muted-foreground text-sm">No duplicate resources detected.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
