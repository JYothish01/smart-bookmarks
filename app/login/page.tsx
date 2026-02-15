"use client";

import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <button onClick={handleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}