"use client";

import { CookiesProvider } from "react-cookie";
import { useState, createContext, useContext, PropsWithChildren } from "react";
import { auth } from "@/lib/firebase-client";
import { User, onAuthStateChanged } from "firebase/auth";

const Context = createContext<User | null | undefined>(undefined);

export function AuthContextProvider({
  children,
  user,
}: PropsWithChildren<{ user?: any }>) {
  const [session, setSession] = useState<User | null | undefined>(user);

  onAuthStateChanged(auth, (u) => setSession(!!u ? u : null));

  return (
    <Context.Provider value={session}>
      <CookiesProvider>{children}</CookiesProvider>
    </Context.Provider>
  );
}

export function useAuthContext() {
  return useContext(Context);
}
