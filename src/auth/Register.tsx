import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { BsCheckLg } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      if (data.token && data.user) {
        login(data.token, data.user);
        navigate('/dashboard');
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthPlaceholder = (provider: string) => {
    alert(`${provider} sign-in will be implemented soon!`);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-4 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[460px] bg-[#110f22]/90 border border-[#211e3b] rounded-[28px] p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-2xl bg-[#7c3aed]/20 text-[#9333ea] border border-[#7c3aed]/40 flex items-center justify-center mx-auto mb-5 text-2xl">
            <BsCheckLg />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Check your inbox</h2>
          <p className="text-sm text-[#8f8bb1] mb-8 leading-relaxed">
            We sent a verification link to <span className="text-[#a78bfa] font-medium">{email}</span>. Please verify your email address to log in.
          </p>
          <Link
            to="/login"
            className="inline-block w-full py-3.5 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#7c3aed]/25"
          >
            Proceed to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-10 shadow-2xl shadow-black/80 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7c3aed] to-[#9333ea] flex items-center justify-center text-white text-base shadow-lg shadow-[#7c3aed]/30">
            <IoSparkles />
          </div>
          <span className="font-extrabold text-xl text-white tracking-tight">
            Canvas<span className="text-[#7c3aed]">RTC</span>
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="text-[26px] font-bold text-white tracking-tight text-center">
          Create your account
        </h1>
        <p className="text-xs text-[#8f8bb1] mt-1 mb-7 text-center">
          Start collaborating in real-time today
        </p>

        {/* OAuth Buttons (Placeholders) */}
        <div className="w-full flex flex-col gap-3">
          <button
            type="button"
            onClick={() => handleOAuthPlaceholder('Google')}
            className="w-full h-11 bg-white hover:bg-slate-100 text-[#171626] font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
          >
            <FcGoogle className="text-lg" />
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleOAuthPlaceholder('GitHub')}
            className="w-full h-11 bg-[#22232c] hover:bg-[#2c2d38] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition active:scale-[0.99]"
          >
            <FaGithub className="text-lg" />
            <span>Continue with GitHub</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-full flex items-center my-6">
          <div className="flex-grow border-t border-[#23203c]"></div>
          <span className="flex-shrink mx-3 text-[10px] font-semibold tracking-wider text-[#635f7d] uppercase">
            OR WITH EMAIL
          </span>
          <div className="flex-grow border-t border-[#23203c]"></div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] focus:bg-[#1a172f] rounded-xl px-4 text-sm text-white placeholder-[#504c6f] outline-none transition"
            />
          </div>

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
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
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

          {/* Terms & Conditions Checkbox */}
          <label className="flex items-center gap-2.5 mt-1 cursor-pointer select-none">
            <div
              onClick={() => setAgreeToTerms(!agreeToTerms)}
              className={`w-4 h-4 rounded flex items-center justify-center transition border ${
                agreeToTerms
                  ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                  : 'bg-[#1a172f] border-[#2a264a]'
              }`}
            >
              {agreeToTerms && <BsCheckLg className="text-[10px]" />}
            </div>
            <span className="text-[11px] text-[#8f8bb1]">
              I agree to the{' '}
              <a href="#terms" className="text-[#7c3aed] hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="text-[#7c3aed] hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-2 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-7 text-xs text-[#8f8bb1] text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#7c3aed] font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;