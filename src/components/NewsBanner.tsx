import { useTacticalData } from "@/lib/useTacticalData";
import { Radio, X } from "lucide-react";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

export function NewsBanner() {
  const { messages } = useTacticalData();
  const [visible, setVisible] = useState(true);
  
  // Find latest broadcast message
  const latestNews = messages
    .filter(m => m.is_broadcast)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

  useEffect(() => {
    setVisible(true);
  }, [latestNews?.id]);

  if (!latestNews || !visible) return null;

  return (
    <div className="bg-primary/20 border-y border-primary/30 py-2 px-4 flex items-center gap-3 animate-slide-in-right glass">
      <div className="flex-shrink-0 animate-pulse">
        <Radio className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2 overflow-hidden">
        <span className="text-[10px] uppercase tracking-wider font-bold text-primary whitespace-nowrap">Operational News:</span>
        <span className="text-sm font-medium truncate text-foreground/90">{latestNews.body}</span>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-auto mr-4">
          {formatDistanceToNow(new Date(latestNews.created_at), { addSuffix: true })}
        </span>
      </div>
      <button 
        onClick={() => setVisible(false)}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
