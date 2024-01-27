"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase-client";
import { getCurrentUser } from "@/lib/firebase";
import { signOut } from "@/lib/firebase-auth";
import LogoutButton from "./LogoutButton";

export default function LoginButton() {
  const user = useAuthContext();
  // const currentUser = await getCurrentUser();
  console.log("user", user);

  // clientside auth handler has not run yet
  // if (typeof user === "undefined") {
  //   return null;
  // }

  if (user) {
    return <LogoutButton />;
  }
  return (
    <Button variant={"ghost"} size={"sm"} asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
