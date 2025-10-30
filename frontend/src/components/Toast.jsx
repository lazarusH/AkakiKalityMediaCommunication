import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const styles = {
    success: {
      background: '#d1fae5',
      border: '2px solid #10b981',
      color: '#065f46'
    },
    error: {
      background: '#fee2e2',
      border: '2px solid #ef4444',
      color: '#991b1b'
    },
    info: {
      background: '#dbeafe',
      border: '2px solid #3b82f6',
      color: '#1e3a8a'
    }
  };

  const icons = {
    success: '✅',
    error: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div style={{
      ...styles[type],
      padding: '15px 20px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      animation: 'slideDown 0.3s ease',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '1.2rem' }}>{icons[type]}</span>
        <span>{message}</span>
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          fontSize: '1.3rem',
          cursor: 'pointer',
          padding: '0 5px',
          color: 'inherit',
          opacity: 0.7
        }}
        onMouseOver={(e) => e.target.style.opacity = '1'}
        onMouseOut={(e) => e.target.style.opacity = '0.7'}
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;








