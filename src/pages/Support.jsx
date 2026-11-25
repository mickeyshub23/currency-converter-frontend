import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Support() {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.name.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email';
    if (!formData.subject.trim()) return 'Please enter a subject';
    if (!formData.message.trim()) return 'Please enter a message';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await api.post('/api/contact', formData);
      setSuccess('Message sent successfully. We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page support-page">
      <nav className="top-nav">
        <Link to="/">CEW Crypto</Link>
        <div className="nav-right">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <button className="btn-logout" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/support" className="nav-link">Support</Link>
            </>
          )}
        </div>
      </nav>

      <main className="main-content">
        <div className="support-card">
          <h1>Send me a message and we will get back to you soon.</h1>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}