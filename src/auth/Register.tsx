import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { BsCheckLg } from 'react-icons/bs';
import { IoSparkles } from 'react-icons/io5';
import { FiRefreshCw } from 'react-icons/fi';
import { randomAvataaarsGrid } from '../lib/avataaars';
import { UserAvatar } from '../components/UserAvatar';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'avatar'>('form');
  const [setupToken, setSetupToken] = useState('');
  const [avatarChoices, setAvatarChoices] = useState<string[]>([]);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  const shuffleAvatars = () => {
    const next = randomAvataaarsGrid(8);
    setAvatarChoices(next);
    setSelectedAvatar(next[0] || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setError('');
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: normalizedEmail, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      setSetupToken(typeof data.setupToken === 'string' ? data.setupToken : '');
      setEmail(normalizedEmail);
      shuffleAvatars();
      setStep('avatar');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      setError('Pick an avatar to continue');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (setupToken) {
        const res = await fetch(`${API_BASE}/api/auth/setup-avatar`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: setupToken, avatarUrl: selectedAvatar }),
        });
        const data = await res.json();
        if (!res.ok) {
          const expired =
            typeof data.error === 'string' && data.error.toLowerCase().includes('expired');
          if (!expired) throw new Error(data.error || 'Failed to save avatar');
        }
      }
      navigate('/verify-email', { state: { email }, replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'avatar') {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-4 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/90 border border-[#211e3b] rounded-[28px] p-6 text-center shadow-2xl backdrop-blur-xl sm:p-10">
          <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Choose your avatar</h2>
          <p className="text-sm text-[#8f8bb1] mb-6 leading-relaxed">
            Pick a random Avataaars face. You can change this later in Settings.
          </p>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-4">
            {avatarChoices.map((url, index) => {
              const isSelected = url === selectedAvatar;
              return (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  onClick={() => setSelectedAvatar(url)}
                  className={`rounded-full p-0.5 transition ${
                    isSelected
                      ? 'ring-2 ring-[#7c3aed] ring-offset-2 ring-offset-[#110f22]'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  <UserAvatar name={name} avatarUrl={url} size={64} />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={shuffleAvatars}
            className="inline-flex items-center gap-1.5 mb-6 px-3 py-1.5 border border-[#3a315f] bg-[#120f22] text-[#d5d1ee] text-xs font-semibold rounded-lg hover:bg-[#1b1738] transition"
          >
            <FiRefreshCw className="text-xs" />
            Shuffle random avatars
          </button>

          <button
            type="button"
            onClick={() => void handleSaveAvatar()}
            disabled={loading || !selectedAvatar}
            className="w-full py-3.5 px-4 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition shadow-lg shadow-[#7c3aed]/25"
          >
            {loading ? 'Saving...' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-6 py-10 sm:px-10 shadow-2xl shadow-black/80 flex flex-col items-center">
        
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
        <h1 className="text-[26px] font-bold text-white tracking-tight text-center">
          Create your account
        </h1>
        <p className="text-xs text-[#8f8bb1] mt-1 mb-7 text-center">
          Start collaborating in real-time today
        </p>

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
                minLength={8}
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