import { createFileRoute, useNavigate, redirect, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppLayout } from "@/components/AppLayout";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppShell,
});

function AppShell() {
  const { loading, user, isDemo } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user && !isDemo) navigate({ to: "/auth" });
  }, [loading, user, isDemo, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!user && !isDemo) return null;

  return <AppLayout><Outlet /></AppLayout>;
}
