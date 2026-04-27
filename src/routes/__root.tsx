import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { DemoStoreProvider } from "@/lib/demoStore";
import { AuthProvider } from "@/lib/auth";
import { NotificationProvider } from "@/lib/notificationContext";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center mesh-bg">
      <div className="glass-strong rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-7xl font-display font-bold text-gradient">404</h1>
        <p className="mt-4 text-muted-foreground">Signal lost. The page you requested isn't on the grid.</p>
        <a href="/" className="inline-flex mt-6 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Return to base
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ReliefSync AI — Disaster Coordination Platform" },
      { name: "description", content: "Real-time coordination, smart team assignment and decision support for disaster response agencies, NGOs and field teams." },
      { property: "og:title", content: "ReliefSync AI — Disaster Coordination Platform" },
      { property: "og:description", content: "Real-time coordination platform for disaster response and rehabilitation." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <DemoStoreProvider>
      <AuthProvider>
        <NotificationProvider>
          <Outlet />
          <Toaster theme="dark" position="top-right" />
        </NotificationProvider>
      </AuthProvider>
    </DemoStoreProvider>
  );
}
