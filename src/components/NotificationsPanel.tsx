import { useNotifications } from "@/lib/notificationContext";
import { useAuth } from "@/lib/auth";
import { useTacticalData } from "@/lib/useTacticalData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, CheckCircle2, AlertCircle, MessageCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationsPanel({ open, onOpenChange }: NotificationsPanelProps) {
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const { effectiveRole } = useAuth();
  const { assignments, disasters, teams } = useTacticalData();
  const [deleting, setDeleting] = useState<string | null>(null);

  const getNotificationIcon = (type?: string) => {
    switch (type) {
      case "assignment":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "update":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "message":
        return <MessageCircle className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4 text-primary" />;
    }
  };

  const getNotificationDetails = (notif: any) => {
    if (notif.type === "assignment") {
      const assignment = assignments.find(a => a.id === notif.related_id);
      const disaster = assignment && disasters.find(d => d.id === assignment.disaster_id);
      return {
        title: notif.title || "New Task Assignment",
        description: notif.body || disaster?.title || "You have been assigned a new task",
      };
    }
    return {
      title: notif.title,
      description: notif.body,
    };
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await supabase.from("notifications").delete().eq("id", id);
      toast.success("Notification removed");
    } catch (err) {
      toast.error("Failed to remove notification");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" /> Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </DialogTitle>
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notif => {
                const { title, description } = getNotificationDetails(notif);
                return (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg border transition-all ${
                      notif.read
                        ? "bg-muted/30 border-border/40"
                        : "bg-primary/5 border-primary/30"
                    } hover:bg-muted/50`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm leading-tight">
                              {title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 leading-tight">
                              {description}
                            </p>
                          </div>
                          {!notif.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notif.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                          <div className="flex gap-1">
                            {!notif.read && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs"
                                onClick={() => markAsRead(notif.id)}
                              >
                                Mark read
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleDelete(notif.id)}
                              disabled={deleting === notif.id}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
