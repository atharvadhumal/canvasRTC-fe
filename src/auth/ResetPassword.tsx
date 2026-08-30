import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HiOutlineKey, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { BsCheck2 } from 'react-icons/bs';
import { Oval } from 'react-loader-spinner';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');

      setIsSuccess(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/80 flex items-center justify-center text-red-400 text-2xl mb-6">
            ✕
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mb-2">
            Invalid Link
          </h1>
          <p className="text-xs text-[#8f8bb1] mb-8 leading-relaxed">
            This password reset link is missing a security token or has expired.
          </p>
          <Link
            to="/forgot-password"
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl flex items-center justify-center transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mb-2">
            Password Reset Complete
          </h1>
          <p className="text-xs text-[#8f8bb1] mb-8 leading-relaxed">
            Your password has been successfully updated. You can now log in with your new credentials.
          </p>
          <Link
            to="/login"
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl flex items-center justify-center transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            Proceed to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        
        {/* Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-[#1e193b] border border-[#342b63] flex items-center justify-center text-[#9333ea] text-2xl mb-6 shadow-inner">
          <HiOutlineKey className="-rotate-45 text-[#a855f7]" />
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Set new password
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-[#8f8bb1] mt-2 mb-8 leading-relaxed max-w-[340px]">
          Please choose a strong password with at least 6 characters.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold text-[#8f8bb1] mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-11 bg-[#1a172f]/80 border border-[#2a264a] focus:border-[#7c3aed] focus:bg-[#1a172f] rounded-xl pl-4 pr-11 text-sm text-white placeholder-[#504c6f] outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99] mt-2"
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
              'Update Password'
            )}
          </button>
        </form>

        <p className="mt-7 text-xs text-[#8f8bb1] text-center">
          Remember your password?{' '}
          <Link to="/login" className="text-[#7c3aed] font-semibold hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default ResetPassword;