"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-950 to-black text-white px-4">

      {/* Card Container */}
      <div
        className="
          w-full max-w-md
          bg-white/10
          backdrop-blur-xl
          border border-white/10
          p-8 sm:p-10
          rounded-3xl
          shadow-2xl
          text-center
        "
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
          Smart Bookmarks
        </h1>

        <p className="text-sm sm:text-base text-gray-400 mb-8">
          Organize your web, beautifully.
        </p>

        <button
          onClick={handleLogin}
          className="
            w-full
            px-6 py-3
            bg-blue-600
            hover:bg-blue-700
            rounded-xl
            font-semibold
            transition
            text-sm sm:text-base
          "
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}