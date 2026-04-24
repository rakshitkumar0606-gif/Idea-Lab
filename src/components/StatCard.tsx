import type { ReactNode } from "react";

export function StatCard({
  label, value, sub, icon, accent = "primary",
}: {
  label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode;
  accent?: "primary" | "warning" | "success" | "destructive";
}) {
  const colorMap = {
    primary: "text-primary",
    warning: "text-warning",
    success: "text-success",
    destructive: "text-destructive",
  };
  return (
    <div className="glass rounded-xl p-5 relative overflow-hidden group animate-scale-in hover:shadow-glow hover:-translate-y-1 transition-all duration-300 cursor-default">
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-colors" />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary/70 transition-colors">{label}</div>
          <div className={`mt-2 text-3xl font-display font-bold ${colorMap[accent]} group-hover:scale-105 origin-left transition-transform`}>{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        </div>
        {icon && <div className={`${colorMap[accent]} opacity-70 group-hover:opacity-100 group-hover:rotate-12 transition-all`}>{icon}</div>}
      </div>
    </div>
  );
}
