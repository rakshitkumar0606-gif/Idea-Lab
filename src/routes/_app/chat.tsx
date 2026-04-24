import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Megaphone, Radio } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/_app/chat")({
  component: ChatPage,
});

function ChatPage() {
  const { effectiveRole, effectiveName } = useAuth();
  const { messages, sendMessage } = useTacticalData();
  const [text, setText] = useState("");
  const [broadcast, setBroadcast] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = effectiveRole === "admin";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  function handleSend() {
    if (!text.trim()) return;
    sendMessage(text.trim(), broadcast);
    setText("");
    setBroadcast(false);
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-display font-bold">Communications</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isAdmin ? "Broadcast announcements or message teams directly." : "Coordinate with command and other teams."}
        </p>
      </div>

      <div className="flex-1 glass rounded-xl flex flex-col overflow-hidden min-h-[400px] animate-scale-in">
        <div ref={scrollRef} className="flex-1 overflow-auto scrollbar-thin p-5 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-20 animate-fade-in">No messages yet. Start the comms channel.</div>
          )}
          {messages.map((m, i) => {
            const isMe = m.sender === effectiveName;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fade-in-up animate-stagger-${Math.min(i + 1, 5)}`}>
                <div className={`max-w-[70%] rounded-xl p-3 ${
                  m.is_broadcast
                    ? "bg-warning/15 border border-warning/40 shadow-[0_0_15px_rgba(var(--warning-rgb),0.05)]"
                    : isMe
                      ? "bg-primary/15 border border-primary/30"
                      : "bg-muted/40 border border-border/40"
                }`}>
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-1">
                    {m.is_broadcast && <Megaphone className="h-3 w-3 text-warning" />}
                    <span className={m.is_broadcast ? "text-warning" : "text-muted-foreground"}>
                      {m.is_broadcast ? "BROADCAST · " : ""}{m.sender} · {m.sender_role}
                    </span>
                    <span className="text-muted-foreground/60">{format(new Date(m.created_at), "HH:mm")}</span>
                  </div>
                  <div className="text-sm">{m.body}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-border/40 p-3 flex gap-2 glass">
          {isAdmin && (
            <Button
              variant={broadcast ? "default" : "outline"}
              size="sm"
              onClick={() => setBroadcast(v => !v)}
              className={broadcast ? "bg-warning text-warning-foreground hover:bg-warning/90" : ""}
            >
              <Megaphone className="h-4 w-4" />
            </Button>
          )}
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder={broadcast ? "Broadcast to all teams…" : "Send message…"}
            className="flex-1"
          />
          <Button onClick={handleSend} className="gap-1">
            <Send className="h-4 w-4" /> Send
          </Button>
        </div>
      </div>
    </div>
  );
}
