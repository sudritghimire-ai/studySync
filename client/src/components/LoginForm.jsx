import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        login({ email, password });
      }}
    >
      <div>
        <label className="block text-sm text-white mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-white/20 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="you@email.com"
        />
      </div>
      <div>
        <label className="block text-sm text-white mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-white/20 text-white placeholder-white/70 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="********"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full rounded-xl py-3 font-bold text-white ${
          loading
            ? "bg-pink-400 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-purple-500 hover:scale-105 transition"
        }`}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
