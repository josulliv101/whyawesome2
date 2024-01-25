"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase-client";

export default function LoginButton() {
  const user = useAuthContext();
  console.log("USER", user);

  const handleLogout = async () => {
    await auth
      .signOut()
      .then((...args) => {
        console.log("signed out", ...args);
      })
      .catch((error) => {
        // An error happened.
        console.log(error);
      });
  };

  // clientside auth handler has not run yet
  if (typeof user === "undefined") {
    return null;
  }

  if (user) {
    return (
      <Button onClick={handleLogout} variant={"ghost"} size={"sm"}>
        Logout
      </Button>
    );
  }
  return (
    <Button variant={"ghost"} size={"sm"} asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}
