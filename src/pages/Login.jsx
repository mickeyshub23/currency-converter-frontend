import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { loginStep1, verifyOtp, resendOtp } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleStep1 = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await loginStep1(email, password);
      setStep(2);
      setResendTimer(60);
      startResendCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a 6-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await verifyOtp(otp, false);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOtp();
      setResendTimer(60);
      startResendCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend code');
    }
  };

  const startResendCountdown = () => {
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(val);
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(paste);
    e.preventDefault();
  };

  return (
    <div className="page auth-page">
<nav className="top-nav">
          <Link to="/">CEW Crypto</Link>
          <Link to="/register" className="nav-link">Register</Link>
          <Link to="/support" className="nav-link">Support</Link>
        </nav>

      <main className="main-content">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to your account</p>

          {error && <div className="error-message">{error}</div>}

          {step === 1 && (
            <form onSubmit={handleStep1} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Sending code...' : 'Continue'}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="otp-step">
              <p className="otp-instruction">Enter the 6-digit code sent to <strong>{email}</strong></p>

              <form onSubmit={handleVerify} className="auth-form">
                <div className="otp-inputs">
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    onPaste={handlePaste}
                    placeholder="000000"
                    autoFocus
                    autoComplete="one-time-code"
                    disabled={loading}
                  />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </form>

              <div className="resend-section">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || loading}
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>

              <p className="auth-switch">
                Don't have an account? <Link to="/register">Create one</Link>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}