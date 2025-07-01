"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 relative overflow-auto">
      {/* background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-3xl animate-pulse-slow transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

<div className="w-full max-w-md mt-16 relative z-10 bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
          {/* header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-cyan-400 to-pink-500 flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1h6v-1a6 6 0 00-9-5.197"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
            StudySync
          </h1>
          <p className="text-white/80 text-sm mt-10">
            {isLogin ? "Sign in to connect" : "Create your StudySync account"}
          </p>
        </div>

        {/* toggle */}
        <div className="flex rounded-xl overflow-hidden mb-6 border border-white/20">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-bold ${
              isLogin ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-bold ${
              !isLogin ? "bg-gradient-to-r from-cyan-400 to-purple-500 text-white" : "text-white/60 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* forms */}
        <div className="relative">
          <div
            className={`transition-all duration-500 ${
              isLogin ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <LoginForm />
          </div>
          <div
            className={`transition-all duration-500 ${
              !isLogin ? "block opacity-100" : "hidden opacity-0"
            }`}
          >
            <SignUpForm />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 5s ease infinite; }
      `}</style>
    </div>
  );
}
