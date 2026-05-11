import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import { useEffect } from "react";
import MainLayout from "../src/components/layout/MainLayout";
import "../src/index.css";
import "../src/App.css";
import { auth } from "../src/lib/firebase";
import { signOutUser } from "../src/services/authService";

// Re-export loader from server-only module
export { loader } from "./root.server";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MainLayout>
          {children}
        </MainLayout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { serverUser, role } = useLoaderData() as { serverUser: any, role: string };
  const location = useLocation();

  useEffect(() => {
    // Sync check on initial mount:
    // If the server says we're NOT authenticated, but the client-side Firebase IS,
    // we should sign out the client to stay in sync.
    const checkSync = async () => {
      const clientUser = auth.currentUser;
      
      // 1. Skip if no client user (nothing to sync)
      if (!clientUser) return;
      
      // 2. Skip if client user is anonymous (guests are allowed without server session)
      if (clientUser.isAnonymous) return;

      // 3. If server has no user but client does:
      if (!serverUser) {
        // Skip on login page to avoid race conditions during login
        if (location.pathname === "/login") return;
        
        // Give a small grace period for loaders to re-run and catch the new cookie
        // This is especially important for SPA navigations after login
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Re-check after delay
        if (!serverUser && auth.currentUser && !auth.currentUser.isAnonymous) {
          console.warn("[AuthSync] Client session found without server session. Clearing client.");
          await signOutUser();
        }
      }
    };

    checkSync();
  }, [serverUser, location.pathname]); // Re-run if serverUser or route changes

  return <Outlet context={{ user: serverUser, role }} />;
}
