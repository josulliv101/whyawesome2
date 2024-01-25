"use client";

import { useState, createContext, useContext, PropsWithChildren } from "react";
import { auth } from "@/lib/firebase-client";
import { User, onAuthStateChanged } from "firebase/auth";

const Context = createContext<User | null | undefined>(undefined);

export function AuthContextProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<User | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setSession(user);
    } else {
      setSession(null);
    }
    setLoading(false);
  });

  if (false && loading) {
    return (
      <main className={""}>
        <div>loading</div>
      </main>
    );
  } else {
    return <Context.Provider value={session}>{children}</Context.Provider>;
  }
}

export function useAuthContext() {
  return useContext(Context);
}
