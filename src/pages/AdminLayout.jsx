import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="admin-layout">
      <nav className="admin-sidebar">
        <div className="admin-brand">CEW Crypto</div>
        <ul className="admin-nav">
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
          <li>
            <Link to="/admin/messages">Messages</Link>
          </li>
        </ul>
        <button className="admin-logout" onClick={handleLogout}>Logout</button>
      </nav>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}