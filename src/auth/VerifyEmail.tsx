import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { BsCheck2 } from 'react-icons/bs';
import { HiOutlineMail } from 'react-icons/hi';
import { Oval } from 'react-loader-spinner';

export const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const registeredEmail = (location.state as { email?: string })?.email || 'jane@example.com';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(() =>
    token ? 'loading' : 'idle'
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    fetch('http://localhost:3000/api/auth/verify-email', {
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

  const handleResendEmail = () => {
    setResending(true);
    setTimeout(() => {
      setResending(false);
      alert(`Verification email resent to ${registeredEmail}!`);
    }, 1200);
  };

  // Success Screen (Token validated via link)
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

  // Token Validation Failed Screen
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
          <p className="text-xs text-[#8f8bb1] mb-8 leading-relaxed">
            {errorMessage || 'This verification link is invalid or has expired.'}
          </p>
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

  // Default Screen (Waiting for user to click verification email link)
  return (
    <div className="min-h-screen bg-[#070611] flex items-center justify-center p-6 font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className="w-full max-w-[480px] bg-[#110f22]/95 border border-[#211e3b] rounded-[32px] px-10 py-12 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        
        {/* Verification Icon Badge / Spinner */}
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
            <BsCheck2 className="stroke-1" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-bold text-white tracking-tight">
          Verify your email
        </h1>

        {/* Subtitle with dynamic email */}
        <p className="text-xs text-[#8f8bb1] mt-2 mb-7">
          We sent a secure validation link to{' '}
          <span className="text-white font-medium">{registeredEmail}</span>
        </p>

        {/* Inner Card Note */}
        <div className="w-full bg-[#18152e]/90 border border-[#292449] rounded-2xl p-6 flex flex-col items-center text-center mb-6">
          <HiOutlineMail className="text-3xl text-[#7c3aed] mb-3" />
          <p className="text-xs text-[#8f8bb1] leading-relaxed max-w-[320px]">
            Click the activation link inside the validation email to finalize registration and start drawing.
          </p>
        </div>

        {/* Resend Button with Spinner */}
        <button
          type="button"
          onClick={handleResendEmail}
          disabled={resending}
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

        {/* Change Email Link */}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-xs font-semibold text-[#7c3aed] hover:text-[#9333ea] transition"
        >
          Change Email Address
        </button>

      </div>
    </div>
  );
};

export default VerifyEmail;