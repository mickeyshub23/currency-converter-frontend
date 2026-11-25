import React from 'react';

export default function StatCard({ title, value, change }) {
  const classes = 'stat-card';

  const changeClass = change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral';

  return (
    <div className={classes}>
      <h3>{title}</h3>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${changeClass}`}>{change > 0 ? '+' : ''}{change}</div>
    </div>
  );
}