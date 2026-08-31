import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { BsCheckLg } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { useAuth } from "../context/AuthContext";
import { API_BASE } from "../config";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to login");

      login(data.token, data.user);

      const next = searchParams.get("next");
      const safeNext =
        next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
      navigate(safeNext);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-10 shadow-2xl shadow-black/80 flex flex-col items-center">
        {/* Brand Header */}
        <Link to="/" className="flex items-center gap-2.5 mb-6 hover:opacity-90 transition">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white text-base shadow-lg shadow-[#7c3aed]/30">
            <IoSparkles />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Canvas<span className="text-[#7c3aed]">RTC</span>
          </span>
        </Link>

        {/* Title & Subtitle */}
        <h1 className="text-[26px] font-bold text-white tracking-tight text-center flex items-center gap-2 justify-center">
          Welcome back <span>👋</span>
        </h1>
        <p className="text-xs text-[#8f8bb1] mt-1 mb-8 text-center">
          Log in to resume your active brainstorming boards
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] focus:bg-[#1a172f] rounded-xl px-4 text-sm text-white placeholder-[#504c6f] outline-none transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#8f8bb1]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-semibold text-[#7c3aed] hover:text-[#9333ea] transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] focus:bg-[#1a172f] rounded-xl pl-4 pr-11 text-sm text-white placeholder-[#504c6f] outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#635f7d] hover:text-[#9e9abf] transition text-lg"
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          {/* Keep me signed in Checkbox */}
          <label className="flex items-center gap-2.5 mt-1 cursor-pointer select-none">
            <div
              onClick={() => setKeepSignedIn(!keepSignedIn)}
              className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                keepSignedIn
                  ? "bg-[#7c3aed] border-[#7c3aed] text-white"
                  : "bg-[#1a172f] border-[#2a264a]"
              }`}
            >
              {keepSignedIn && <BsCheckLg className="text-[10px]" />}
            </div>
            <span className="text-[11px] text-[#8f8bb1]">
              Keep me signed in on this device
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-xs text-[#8f8bb1] text-center">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#7c3aed] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
