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
  const { serverUser } = useLoaderData() as { serverUser: any };
  const location = useLocation();

  useEffect(() => {
    // Sync check on initial mount:
    // If the server says we're NOT authenticated, but the client-side Firebase IS,
    // we should sign out the client to stay in sync.
    // We skip this if we're on the login page as we might be mid-login flow.
    const checkSync = async () => {
      const clientUser = auth.currentUser;
      if (!serverUser && clientUser && location.pathname !== "/login") {
        console.warn("[AuthSync] Initial check: Client session found without server session. Clearing client.");
        await signOutUser();
      }
    };

    checkSync();
  }, []); // Only run once on mount

  return <Outlet />;
}
