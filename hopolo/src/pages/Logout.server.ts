import { redirect } from "react-router";
import { getSignOutCookie } from "../lib/auth.server";

export async function loader() {
  return redirect("/");
}

export async function action() {
  return redirect("/", {
    headers: {
      "Set-Cookie": getSignOutCookie(),
    },
  });
}
