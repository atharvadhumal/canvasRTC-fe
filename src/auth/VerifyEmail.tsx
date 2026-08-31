import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BsCheck2 } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { Oval } from 'react-loader-spinner';
import { API_BASE } from '../config';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const registeredEmail =
    (location.state as { email?: string } | null)?.email?.trim().toLowerCase() ||
    searchParams.get('email')?.trim().toLowerCase() ||
    '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(() =>
    token ? 'loading' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    fetch(`${API_BASE}/api/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed');
        if (isMounted) {
          setStatus('success');
        }
      })
      .catch((err: Error) => {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResendEmail = async () => {
    if (!registeredEmail) {
      setErrorMessage('Register again or use the email from your sign-up to resend verification.');
      return;
    }

    setResending(true);
    setErrorMessage('');
    setResent(false);

    try {
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to resend email');
      setResent(true);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to resend email');
    } finally {
      setResending(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
            <BsCheck2 className="stroke-1" />
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mb-2">
            Email verified!
          </h1>
          <p className="text-xs text-[#8f8bb1] mb-8 leading-relaxed">
            Your email is confirmed. You are ready to start collaborating on live whiteboards.
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

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border-2 border-red-500/80 flex items-center justify-center text-red-400 text-2xl mb-6">
            ✕
          </div>
          <h1 className="text-[26px] font-bold text-white tracking-tight mb-2">
            Verification Failed
          </h1>
          <p className="text-xs text-[#8f8bb1] mb-4 leading-relaxed">
            {errorMessage || 'This verification link is invalid or has expired.'}
          </p>
          {registeredEmail && (
            <button
              type="button"
              onClick={() => void handleResendEmail()}
              disabled={resending}
              className="w-full h-11 mb-3 bg-[#141129] border border-[#2a264a] hover:bg-[#1b1738] disabled:opacity-50 text-[#dfe7ff] font-semibold text-sm rounded-xl transition"
            >
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
          <Link
            to="/register"
            className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-sm rounded-xl flex items-center justify-center transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99]"
          >
            Register Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 text-2xl mb-6">
          {status === 'loading' ? (
            <Oval
              visible={true}
              height="28"
              width="28"
              color="#10b981"
              secondaryColor="#064e3b"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="oval-loading"
            />
          ) : (
            <HiOutlineMail />
          )}
        </div>

        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Verify your email
        </h1>

        <p className="text-xs text-[#8f8bb1] mt-2 mb-7">
          {registeredEmail ? (
            <>
              We sent a secure validation link to{' '}
              <span className="text-white font-medium">{registeredEmail}</span>
            </>
          ) : (
            'Check your inbox for the verification link we sent after sign-up.'
          )}
        </p>

        <div className="w-full bg-[#18152e]/90 border border-[#292449] rounded-2xl p-6 flex flex-col items-center text-center mb-6">
          <HiOutlineMail className="text-3xl text-[#7c3aed] mb-3" />
          <p className="text-xs text-[#8f8bb1] leading-relaxed max-w-[320px]">
            Click the activation link inside the validation email to finalize registration and start drawing.
          </p>
        </div>

        {errorMessage && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        {resent && (
          <div className="w-full mb-4 px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl">
            Verification email sent. Check your inbox and spam folder.
          </div>
        )}

        <button
          type="button"
          onClick={() => void handleResendEmail()}
          disabled={resending || !registeredEmail}
          className="w-full h-11 bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-[#7c3aed]/25 active:scale-[0.99] mb-4"
        >
          {resending ? (
            <Oval
              visible={true}
              height="18"
              width="18"
              color="#ffffff"
              secondaryColor="#a78bfa"
              strokeWidth={4}
              strokeWidthSecondary={4}
              ariaLabel="oval-resend-loading"
            />
          ) : (
            'Resend Email'
          )}
        </button>

        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-xs font-semibold text-[#7c3aed] hover:text-[#9333ea] transition"
        >
          Change Email Address
        </button>

        <Link
          to="/login"
          className="mt-6 text-xs font-semibold text-[#8f8bb1] hover:text-white transition"
        >
          Already verified? Sign in
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
