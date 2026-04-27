import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import { toast } from "sonner";
import { Bell } from "lucide-react";

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
  type?: "assignment" | "update" | "message";
  related_id?: string;
}

type NotificationValue = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  createNotification: (title: string, body: string, type?: string) => Promise<void>;
};

const Ctx = createContext<NotificationValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, isDemo } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (isDemo || !user) return;

    // Initial fetch
    (async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (data) {
        setNotifications(data as Notification[]);
      }
    })();

    // Subscribe to new notifications
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload: any) => {
          const newNotif = payload.new as Notification;
          setNotifications(prev => [newNotif, ...prev]);
          // Show toast for new notifications
          toast.info(newNotif.title, {
            description: newNotif.body,
            icon: <Bell className="h-4 w-4" />,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, isDemo]);

  const markAsRead = async (id: string) => {
    try {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const createNotification = async (title: string, body: string, type?: string) => {
    if (!user) return;
    try {
      await supabase.from("notifications").insert({
        user_id: user.id,
        title,
        body,
        type,
      });
    } catch (err) {
      console.error("Failed to create notification:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Ctx.Provider value={{ notifications, unreadCount, markAsRead, createNotification }}>
      {children}
    </Ctx.Provider>
  );
}

export function useNotifications() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useNotifications must be used within NotificationProvider");
  return v;
}
