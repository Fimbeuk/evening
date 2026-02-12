"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Evening</h1>
            <span className="text-sm text-slate-400 hidden sm:inline">
              Gestion des places
            </span>
          </div>

          <div className="flex items-center gap-4">
            {status === "loading" && (
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
            )}
            {status === "authenticated" && session?.user && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">
                    {session.user.name}
                  </p>
                  <p className="text-xs text-slate-400">{session.user.email}</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">
                  {session.user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "?"}
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-100"
                >
                  Déconnexion
                </button>
              </div>
            )}
            {status === "unauthenticated" && (
              <button
                onClick={() => signIn("azure-ad")}
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                Se connecter
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
