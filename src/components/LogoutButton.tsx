"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuthContext } from "./AuthContext";
import { auth } from "@/lib/firebase-client";
import { getCurrentUser } from "@/lib/firebase";
import { signOut } from "@/lib/firebase-auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = async () => {
    const isSuccess = await signOut();
    if (isSuccess) {
      // router.push("/?logout", {});
    }
  };

  return (
    <Button onClick={handleLogout} variant={"ghost"} size={"sm"}>
      Logout
    </Button>
  );
}
