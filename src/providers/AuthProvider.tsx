import { supabase } from "@/lib/supabase";
import { Tables } from "@/types";
import { Session } from "@supabase/supabase-js";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  session: Session | null;
  profile: Tables<"profiles"> | null;
  loading: boolean;
  isBusiness: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  isBusiness: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      fetchSession();
    });
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);

      if (session) {
        // fetch profile
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        setProfile(data || null);
      }
      setLoading(false);
    };
    // supabase.auth.signOut();

    fetchSession();
    return () => {
      data?.subscription.unsubscribe();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile: profile,
        isBusiness: profile?.role === "business",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);