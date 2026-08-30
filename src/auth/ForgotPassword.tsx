import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineKey } from 'react-icons/hi';
import { HiArrowLeft } from 'react-icons/hi2';
import { BsCheck2 } from 'react-icons/bs';
import { Oval } from 'react-loader-spinner';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send reset link');

      setIsSubmitted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mb-2">
            Check your inbox
          </h1>
          <p className="text-xs text-[#8f8bb1] mb-8 leading-relaxed max-w-[320px]">
            If an account exists for <span className="text-white font-medium">{email}</span>, you will receive a temporary password recovery link shortly.
          </p>
          <Link
            to="/login"
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl flex items-center justify-center transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        
        {/* Key Icon Badge */}
        <div className="w-16 h-16 rounded-full bg-[#1e193b] border border-[#342b63] flex items-center justify-center text-[#9333ea] text-2xl mb-6 shadow-inner">
          <HiOutlineKey className="-rotate-45 text-[#a855f7]" />
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Reset your password
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-[#8f8bb1] mt-2 mb-8 leading-relaxed max-w-[340px]">
          Enter the email registered with your account and we will send a temporary password recovery link.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-2">
              Registered Email
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

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99] mt-1"
          >
            {loading ? (
              <Oval
                visible={true}
                height="18"
                width="18"
                color="#ffffff"
                secondaryColor="#a78bfa"
                strokeWidth={4}
                strokeWidthSecondary={4}
                ariaLabel="oval-loading"
              />
            ) : (
              'Send Reset Link'
            )}
          </button>
        </form>

        {/* Back to sign in link */}
        <Link
          to="/login"
          className="mt-7 flex items-center gap-2 text-xs font-semibold text-[#7c3aed] hover:text-[#9333ea] transition group"
        >
          <HiArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to sign in</span>
        </Link>

      </div>
    </div>
  );
};

export default ForgotPassword;