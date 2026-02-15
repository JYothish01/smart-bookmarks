"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  // If user already logged in, redirect to home
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/");
      }
    };

    checkUser();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          process.env.NEXT_PUBLIC_SITE_URL || window.location.origin,
      },
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-900 to-black text-white">
      <div className="bg-white/10 backdrop-blur-lg p-10 rounded-2xl shadow-2xl text-center">
        <h1 className="text-2xl font-bold mb-6">Smart Bookmarks</h1>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}