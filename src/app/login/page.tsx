"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
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
          <h1 className="text-2xl font-bold text-slate-800">Evening</h1>
          <p className="text-slate-500 mt-2">
            Connectez-vous pour réserver votre place au bureau
          </p>
        </div>

        <button
          onClick={() =>
            signIn("azure-ad", { callbackUrl: "/" })
          }
          className="w-full flex items-center justify-center gap-3 bg-[#0078d4] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#106ebe] transition-colors shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
            <rect width="10" height="10" fill="#f25022" />
            <rect x="11" width="10" height="10" fill="#7fba00" />
            <rect y="11" width="10" height="10" fill="#00a4ef" />
            <rect x="11" y="11" width="10" height="10" fill="#ffb900" />
          </svg>
          Se connecter avec Microsoft
        </button>

        <p className="text-xs text-center text-slate-400">
          Utilisez votre compte professionnel Azure AD
        </p>
      </div>
    </div>
  );
}
