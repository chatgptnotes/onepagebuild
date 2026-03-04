'use client';
export default function EditorError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Editor Error</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>{error.message}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
          <button onClick={reset} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}>Try Again</button>
          <a href="/sites" style={{ padding: '0.5rem 1rem', background: '#1e293b', color: '#e2e8f0', borderRadius: '0.5rem', textDecoration: 'none', border: '1px solid #334155' }}>My Sites</a>
        </div>
      </div>
    </div>
  );
}
