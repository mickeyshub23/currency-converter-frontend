import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Users() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDesc, setSortDesc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/admin/users', {
          params: { page, limit, search, sort: sortBy, desc: sortDesc },
        });
        setData(response.data.users || []);
        setTotal(response.data.total || 0);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [page, limit, search, sortBy, sortDesc]);

  const handleSuspend = async (id, active) => {
    try {
      await api.patch(`/api/admin/users/${id}/status`, { active });
      setPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/api/admin/users/${id}/role`, { role });
      setPage(page);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change role');
    }
  };

  if (isLoading) {
    return <div className="loading-users">Loading users...</div>;
  }

  return (
    <section className="admin-users">
      <div className="table-header">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="page-size">
          <span>Per page:</span>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {error && <div className="error-users">{error}</div>}

      {data.length === 0 && !error ? (
        <div className="empty-state">
          <p>No users found</p>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-badge ${u.is_active ? 'status-active' : 'status-inactive'}`}>
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="actions">
                  {!u.is_active ? (
                    <button onClick={() => handleSuspend(u.id, true)}>Activate</button>
                  ) : (
                    <button onClick={() => handleSuspend(u.id, false)}>Suspend</button>
                  )}
                  {user?.role === 'admin' && u.role !== 'admin' && (
                    <button onClick={() => handleRoleChange(u.id, 'admin')}>Make Admin</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>Page {page} of {Math.ceil(total / limit)}</span>
        <button disabled={page * limit >= total} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </section>
  );
}