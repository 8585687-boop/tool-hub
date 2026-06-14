function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: '200px',
      padding: '40px',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '32px 48px',
        borderRadius: 'var(--radius-lg, 12px)',
        background: 'var(--surface, #fff)',
        border: '1px solid var(--border, #e5e7eb)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.08))',
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          border: '3px solid var(--border, #e5e7eb)',
          borderTopColor: 'var(--accent, #6366f1)',
          borderRadius: '50%',
          animation: 'loading-spin 0.8s linear infinite',
        }} />
        <span style={{
          fontSize: '14px',
          color: 'var(--text-secondary, #6b7280)',
          fontWeight: 500,
        }}>
          Loading tool...
        </span>
      </div>
      <style>{`
        @keyframes loading-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default Loading
