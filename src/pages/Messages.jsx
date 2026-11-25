import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

export default function Messages() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/api/admin/messages');
        setMessages(response.data.messages || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleOpen = (msg) => {
    setSelectedMessage(msg);
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleMarkReplied = async (id) => {
    try {
      await api.patch(`/api/admin/messages/${id}/replied`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, is_replied: true } : m)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark replied');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await api.delete(`/api/admin/messages/${id}`);
      setMessages(messages.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete message');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/api/admin/messages/${id}/read`);
      setMessages(messages.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark read');
    }
  };

  if (isLoading) {
    return <div className="loading-messages">Loading messages...</div>;
  }

  return (
    <section className="admin-messages">
      {error && <div className="error-messages">{error}</div>}

      {selectedMessage ? (
        <div className="message-detail" onClick={handleClose}>
          <div className="message-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleClose}>&times;</button>
            <h2>Message Details</h2>
            <p><strong>From:</strong> {selectedMessage.sender_name} ({selectedMessage.sender_email})</p>
            <p><strong>Subject:</strong> {selectedMessage.subject}</p>
            <p><strong>Sent:</strong> {new Date(selectedMessage.created_at).toLocaleString()}</p>
            <div className="message-body">
              <strong>Message:</strong>
              <p>{selectedMessage.body}</p>
            </div>
            <div className="message-actions">
              {!selectedMessage.is_read && (
                <button onClick={() => handleMarkRead(selectedMessage.id)}>Mark Read</button>
              )}
              {!selectedMessage.is_replied && (
                <button onClick={() => handleMarkReplied(selectedMessage.id)}>Mark Replied</button>
              )}
              {user?.role === 'admin' && (
                <button className="btn-danger" onClick={() => handleDelete(selectedMessage.id)}>Delete</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="empty-state">
              <p>No messages found</p>
            </div>
          ) : (
            <ul>
              {messages.map((msg) => (
                <li key={msg.id} className={`message-item ${!msg.is_read ? 'unread' : ''} ${msg.is_replied ? 'replied' : ''}`} onClick={() => handleOpen(msg)}>
                  <div className="message-info">
                    <span className="sender">{msg.sender_name}</span>
                    <span className="subject">{msg.subject}</span>
                    <span className="preview">{msg.body.substring(0, 80)}...</span>
                    <span className="time">{new Date(msg.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="message-badges">
                    {!msg.is_read && <span className="badge unread">Unread</span>}
                    {msg.is_replied && <span className="badge replied">Replied</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}