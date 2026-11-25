import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setError('Admin access required');
      setIsLoading(false);
      return;
    }

    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/admin/stats');
        setStats(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch stats');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [isAuthenticated, user]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return <div className="access-denied">Admin access required</div>;
  }

  if (isLoading) {
    return <div className="loading-stats">Loading stats...</div>;
  }

  if (error) {
    return <div className="error-stats">{error}</div>;
  }

  const statsData = stats || {};

  return (
    <section className="admin-dashboard">
      <div className="stats-grid">
        <StatCard title="Total Users" value={statsData.total_users || 0} />
        <StatCard title="Active Users" value={statsData.active_users || 0} />
        <StatCard title="24h Volume" value={statsData['24h_volume'] || '0.00'} />
        <StatCard title="Avg Portfolio" value={`$${statsData.avg_portfolio || 0}`} />
      </div>
    </section>
  );
}