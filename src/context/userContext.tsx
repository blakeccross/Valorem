"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { FC, PropsWithChildren } from "react";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
type User = Database["public"]["Tables"]["profiles"]["Row"];
type Orginizations = Database["public"]["Tables"]["organizations"]["Row"];

export const UserContext = createContext<any | null>(null);

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClientComponentClient<Database>();
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<Orginizations[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  async function handleGetSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
  }

  async function handleGetUser() {
    let { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session?.user.id || "")
      .single();
    if (user) {
      setUser(user);
    }
    if (error) {
      console.log(error);
    }
  }

  async function handleGetOrganizations() {
    let { data: orgs, error } = await supabase
      .from("user_organizations")
      .select("organizations(*)")
      .eq("user", session?.user.id || "");
    if (orgs) {
      let formattedOrganizations: Orginizations[] = orgs
        .flatMap((item) => item.organizations || []) // Flatten and filter out null values
        .filter(Boolean);

      setOrganizations(formattedOrganizations);
    }
    if (error) {
      console.log(error);
    }
  }

  async function SignOut() {
    let { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setUser(null);
      router.push("/");
    }
  }

  useEffect(() => {
    if (session) {
      handleGetUser();
      handleGetOrganizations();
    }
  }, [session]);

  useEffect(() => {
    handleGetSession();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return <UserContext.Provider value={{ user, organizations, SignOut }}>{children}</UserContext.Provider>;
}
