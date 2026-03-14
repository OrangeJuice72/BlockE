import { useState, useEffect } from 'react';
import { getLeases, deleteLease } from '../utils/leaseUtils';

const Leases = () => {
  const [leases, setLeases] = useState([]);

  useEffect(() => {
    loadLeases();
  }, []);

  const loadLeases = () => {
    const data = getLeases();
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
    setLeases(data);
  };

  const handleDelete = (id) => {
    deleteLease(id);
    loadLeases();
  };

  return (
    <div className="card" style={{ height: 'fit-content', animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards', opacity: 1, transform: 'translateY(0)' }}>
      <div className="header" style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', background: 'linear-gradient(to right, #a5b4fc, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Active Leases
        </h1>
        <p className="subtitle">Quick overview of existing reminders</p>
      </div>

      <div id="leasesList">
        {leases.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
            No active leases found.
          </p>
        ) : (
          leases.map((lease) => (
            <div key={lease.id} className="lease-item">
              <div className="lease-info">
                <span className="lease-tenant">
                  {lease.tenant} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.8rem' }}>({lease.unit})</span>
                </span>
                <span className="lease-date">
                  Ends: {new Date(lease.date + 'T12:00:00').toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              <button className="delete-btn" onClick={() => handleDelete(lease.id)} title="Remove">
                <svg className="icon" viewBox="0 0 24 24" style={{ width: '18px', height: '18px' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leases;
