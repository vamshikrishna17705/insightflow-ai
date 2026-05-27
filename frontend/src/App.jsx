import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8000'

const theme = {
  bg: '#060612',
  bg2: '#0d0d20',
  bg3: '#12122a',
  card: 'rgba(255,255,255,0.03)',
  border: 'rgba(108,99,255,0.15)',
  border2: 'rgba(108,99,255,0.4)',
  accent: '#6c63ff',
  accent2: '#a78bfa',
  green: '#22d3a0',
  red: '#f87171',
  amber: '#fbbf24',
  blue: '#60a5fa',
  pink: '#f472b6',
  text: '#e0e0ff',
  text2: '#8b90b8',
  text3: '#4a4f72',
}

const glow = (color) => `0 0 20px ${color}33, 0 0 60px ${color}11`
const cardGlow = `0 8px 32px rgba(108,99,255,0.08), 0 2px 8px rgba(0,0,0,0.4)`

const styles = {
  app: {
    background: theme.bg,
    minHeight: '100vh',
    color: theme.text,
    fontFamily: "'Inter', 'DM Sans', sans-serif",
    overflow: 'hidden',
  },
  sidebar: {
    position: 'fixed',
    left: 0, top: 0, bottom: 0,
    width: 220,
    background: 'rgba(13,13,32,0.95)',
    backdropFilter: 'blur(20px)',
    borderRight: `1px solid ${theme.border}`,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    padding: '0 0 24px 0',
  },
  main: {
    marginLeft: 220,
    minHeight: '100vh',
    background: theme.bg,
    position: 'relative',
  },
  topbar: {
    position: 'sticky', top: 0, zIndex: 50,
    height: 60,
    background: 'rgba(6,6,18,0.8)',
    backdropFilter: 'blur(20px)',
    borderBottom: `1px solid ${theme.border}`,
    display: 'flex', alignItems: 'center',
    padding: '0 32px', gap: 16,
  },
  content: { padding: '32px' },
  card: {
    background: theme.card,
    border: `1px solid ${theme.border}`,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    backdropFilter: 'blur(10px)',
    boxShadow: cardGlow,
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
}

// Floating orbs background
function Orbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', top: -200, right: -100,
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        animation: 'float1 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400,
        borderRadius: '50%', bottom: 100, left: 100,
        background: 'radial-gradient(circle, rgba(34,211,160,0.06) 0%, transparent 70%)',
        animation: 'float2 10s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 300, height: 300,
        borderRadius: '50%', top: '40%', left: '40%',
        background: 'radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)',
        animation: 'float3 12s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,40px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(40px,-30px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-20px,20px)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.3); border-radius: 2px; }
      `}</style>
    </div>
  )
}

function Logo() {
  return (
    <div style={{ padding: '24px 20px', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #6c63ff, #f472b6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, boxShadow: glow('#6c63ff'),
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>InsightFlow</div>
          <div style={{ fontSize: 9, color: theme.text3, letterSpacing: '2px', fontFamily: 'monospace' }}>AI ANALYTICS</div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 12px', margin: '2px 10px',
      borderRadius: 10, cursor: 'pointer',
      background: active ? 'rgba(108,99,255,0.15)' : 'transparent',
      border: active ? '1px solid rgba(108,99,255,0.3)' : '1px solid transparent',
      color: active ? theme.accent2 : theme.text2,
      fontSize: 13, fontWeight: active ? 500 : 400,
      transition: 'all 0.2s',
      boxShadow: active ? glow('#6c63ff') : 'none',
    }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 10, padding: '2px 6px', borderRadius: 4,
          background: 'rgba(108,99,255,0.2)', color: theme.accent2,
          fontFamily: 'monospace',
        }}>{badge}</span>
      )}
    </div>
  )
}

function KPICard({ label, value, color, icon, sub }) {
  return (
    <div style={{
      ...styles.card,
      position: 'relative', overflow: 'hidden',
      animation: 'fadeIn 0.5s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '44'
        e.currentTarget.style.boxShadow = `0 0 30px ${color}22, ${cardGlow}`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border
        e.currentTarget.style.boxShadow = cardGlow
      }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ position: 'absolute', right: 16, top: 16, fontSize: 28, opacity: 0.08 }}>{icon}</div>
      <div style={{ fontSize: 10, color: theme.text3, letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: 10 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, letterSpacing: '-1px', marginBottom: 4, textShadow: `0 0 20px ${color}44` }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: theme.text3 }}>{sub}</div>}
    </div>
  )
}

function GlassCard({ children, style = {}, accent }) {
  return (
    <div style={{
      ...styles.card, ...style,
      animation: 'fadeIn 0.4s ease',
    }}
      onMouseEnter={e => {
        if (accent) e.currentTarget.style.borderColor = accent + '44'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border
      }}>
      {children}
    </div>
  )
}

function SectionTitle({ children, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{children}</div>
      {badge && (
        <span style={{
          fontSize: 9, padding: '3px 8px', borderRadius: 4,
          background: 'rgba(108,99,255,0.15)', color: theme.accent2,
          border: '1px solid rgba(108,99,255,0.2)',
          fontFamily: 'monospace', letterSpacing: '1px',
        }}>{badge}</span>
      )}
    </div>
  )
}

function BarRow({ label, value, max, color }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <span style={{ fontSize: 12, color: theme.text2, minWidth: 70 }}>{label}</span>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: 4, width: pct + '%',
          background: `linear-gradient(90deg, ${color}, ${color}88)`,
          boxShadow: `0 0 8px ${color}44`,
          transition: 'width 1s ease',
        }} />
      </div>
      <span style={{ fontSize: 11, color: theme.text3, minWidth: 70, textAlign: 'right', fontFamily: 'monospace' }}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    </div>
  )
}

function StatusDot({ active }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 7, height: 7, borderRadius: '50%',
        background: active ? theme.green : theme.red,
        boxShadow: active ? glow(theme.green) : 'none',
        animation: active ? 'pulse 2s infinite' : 'none',
      }} />
      <span style={{ fontSize: 11, color: active ? theme.green : theme.red, fontFamily: 'monospace' }}>
        {active ? 'LIVE' : 'OFFLINE'}
      </span>
    </div>
  )
}

export default function App() {
  const [datasetId, setDatasetId] = useState(localStorage.getItem('dataset_id') || '')
  const [page, setPage] = useState('upload')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [chatAnswer, setChatAnswer] = useState('')
  const [error, setError] = useState('')
  const [backendLive, setBackendLive] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  useEffect(() => {
    axios.get(API + '/').then(() => setBackendLive(true)).catch(() => setBackendLive(false))
  }, [])

  const uploadFile = async (file) => {
    if (!file) return
    setLoading(true)
    setError('')
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post(API + '/api/upload/', form)
      const id = res.data.dataset_id
      setDatasetId(id)
      localStorage.setItem('dataset_id', id)
      setPage('upload')
    } catch {
      setError('Upload failed. Check backend is running.')
    }
    setLoading(false)
  }

  const handleFileInput = (e) => uploadFile(e.target.files?.[0])
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    uploadFile(e.dataTransfer.files?.[0])
  }

  const loadPage = async (pageName, url) => {
    setLoading(true)
    setError('')
    setData(null)
    try {
      const res = await axios.get(url)
      setData(res.data)
      setPage(pageName)
    } catch {
      setError('Failed to load data.')
    }
    setLoading(false)
  }

  const askChat = async () => {
    if (!question.trim()) return
    setLoading(true)
    setChatAnswer('')
    try {
      const res = await axios.post(API + '/api/insights/chat', { dataset_id: datasetId, question })
      setChatAnswer(res.data.answer)
    } catch {
      setChatAnswer('Error: Could not get answer.')
    }
    setLoading(false)
  }

  const nav = [
    { id: 'upload', icon: '📤', label: 'Upload' },
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'insights', icon: '🤖', label: 'AI Insights', badge: 'NEW' },
    { id: 'anomalies', icon: '🚨', label: 'Anomalies' },
    { id: 'chat', icon: '💬', label: 'Ask Data' },
  ]

  const handleNav = (id) => {
    if (!datasetId && id !== 'upload') return
    if (id === 'dashboard') loadPage('dashboard', API + '/api/dashboard/' + datasetId)
    else if (id === 'insights') loadPage('insights', API + '/api/insights/' + datasetId)
    else if (id === 'anomalies') loadPage('anomalies', API + '/api/anomaly/' + datasetId)
    else setPage(id)
  }

  return (
    <div style={styles.app}>
      <Orbs />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <Logo />
        <div style={{ padding: '20px 0', flex: 1 }}>
          <div style={{ fontSize: 9, color: theme.text3, letterSpacing: '2px', padding: '0 22px', marginBottom: 8, fontFamily: 'monospace' }}>WORKSPACE</div>
          {nav.map(n => (
            <NavItem key={n.id} icon={n.icon} label={n.label} badge={n.badge}
              active={page === n.id}
              onClick={() => handleNav(n.id)} />
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22d3a0, #60a5fa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#000',
            }}>U</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 500 }}>User</div>
              <div style={{ fontSize: 10, color: theme.text3 }}>Pro Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Topbar */}
        <div style={styles.topbar}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>
            {page === 'upload' && '📤 Upload Dataset'}
            {page === 'dashboard' && '📊 Dashboard'}
            {page === 'insights' && '🤖 AI Insights'}
            {page === 'anomalies' && '🚨 Anomaly Detection'}
            {page === 'chat' && '💬 Ask Your Data'}
          </div>
          {datasetId && (
            <div style={{
              fontSize: 11, fontFamily: 'monospace', color: theme.text3,
              background: 'rgba(108,99,255,0.1)', border: `1px solid ${theme.border}`,
              padding: '4px 10px', borderRadius: 6,
            }}>
              dataset: {datasetId}
            </div>
          )}
          <div style={{ marginLeft: 'auto' }}>
            <StatusDot active={backendLive} />
          </div>
        </div>

        {/* Content */}
        <div style={{ ...styles.content, position: 'relative', zIndex: 1 }}>

          {loading && (
            <div style={{
              position: 'fixed', top: 60, left: 220, right: 0, bottom: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(6,6,18,0.7)', backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 48, height: 48, border: `2px solid ${theme.border}`,
                  borderTop: `2px solid ${theme.accent}`, borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
                }} />
                <div style={{ color: theme.accent2, fontSize: 13, fontFamily: 'monospace' }}>Processing...</div>
              </div>
            </div>
          )}

          {error && (
            <div style={{
              ...styles.card, borderColor: theme.red + '44',
              color: theme.red, fontSize: 13, marginBottom: 20,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* UPLOAD PAGE */}
          {page === 'upload' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 24 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Upload Dataset</h2>
                <p style={{ fontSize: 13, color: theme.text2 }}>Drop your business data and get instant AI-powered analytics</p>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  border: `2px dashed ${dragOver ? theme.accent : theme.border}`,
                  borderRadius: 20, padding: '60px 40px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(108,99,255,0.05)' : theme.card,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s',
                  boxShadow: dragOver ? glow(theme.accent) : cardGlow,
                  marginBottom: 24,
                }}>
                <input id="fileInput" type="file" accept=".csv,.xlsx,.json" onChange={handleFileInput} style={{ display: 'none' }} />
                <div style={{ fontSize: 48, marginBottom: 16, opacity: dragOver ? 1 : 0.4 }}>📂</div>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>
                  {dragOver ? 'Drop to upload' : 'Drag & drop your file here'}
                </div>
                <div style={{ fontSize: 12, color: theme.text3, marginBottom: 20 }}>or click to browse</div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                  {['CSV', 'Excel', 'JSON'].map(f => (
                    <span key={f} style={{
                      fontSize: 11, padding: '4px 10px', borderRadius: 6,
                      background: 'rgba(108,99,255,0.1)', border: `1px solid ${theme.border}`,
                      color: theme.accent2, fontFamily: 'monospace',
                    }}>{f}</span>
                  ))}
                </div>
              </div>

              {datasetId && (
                <GlassCard accent={theme.green}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 24 }}>✅</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: theme.green, marginBottom: 2 }}>Dataset Ready</div>
                      <div style={{ fontSize: 12, color: theme.text2 }}>ID: <span style={{ fontFamily: 'monospace', color: theme.accent2 }}>{datasetId}</span> — Click Dashboard to explore</div>
                    </div>
                    <button onClick={() => handleNav('dashboard')} style={{
                      marginLeft: 'auto', padding: '8px 16px', borderRadius: 8,
                      background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                      border: 'none', color: '#fff', fontSize: 12, cursor: 'pointer',
                      fontWeight: 500, boxShadow: glow(theme.accent),
                    }}>View Dashboard →</button>
                  </div>
                </GlassCard>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginTop: 8 }}>
                {[
                  { icon: '🔧', title: 'Auto ETL', desc: 'Clean & transform automatically' },
                  { icon: '📊', title: 'Dashboards', desc: 'Instant visual analytics' },
                  { icon: '🤖', title: 'AI Insights', desc: 'Gemini-powered analysis' },
                  { icon: '🚨', title: 'Anomalies', desc: 'Fraud & outlier detection' },
                ].map((f, i) => (
                  <GlassCard key={i} style={{ textAlign: 'center', padding: 20 }}>
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: 11, color: theme.text3 }}>{f.desc}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* DASHBOARD PAGE */}
          {page === 'dashboard' && data && !data.error && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 20 }}>
                <KPICard label="TOTAL ROWS" value={data.rows?.toLocaleString()} color={theme.green} icon="📋" sub="Records processed" />
                <KPICard label="COLUMNS" value={data.columns?.length} color={theme.blue} icon="📐" sub="Fields detected" />
                <KPICard label="NUMERIC COLS" value={data.numeric_columns?.length} color={theme.amber} icon="🔢" sub="Analyzable fields" />
              </div>

              {Object.entries(data.summary || {}).filter(([col]) => ['units', 'unit_price', 'revenue'].includes(col)).length > 0 && (
                <GlassCard>
                  <SectionTitle badge="SUMMARY">Column Analytics</SectionTitle>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                    {Object.entries(data.summary || {}).filter(([col]) => ['units', 'unit_price', 'revenue'].includes(col)).map(([col, stats]) => (
                      <div key={col} style={{
                        background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: 16,
                        border: `1px solid ${theme.border}`,
                      }}>
                        <div style={{ fontSize: 10, color: theme.accent2, letterSpacing: '1.5px', fontFamily: 'monospace', marginBottom: 12 }}>{col.toUpperCase()}</div>
                        {[['Total', stats.total, theme.green], ['Avg', stats.mean, theme.blue], ['Max', stats.max, theme.amber], ['Min', stats.min, theme.red]].map(([l, v, c]) => (
                          <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                            <span style={{ color: theme.text3 }}>{l}</span>
                            <span style={{ color: c, fontFamily: 'monospace', fontWeight: 600 }}>{v?.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {Object.keys(data.monthly_trend || {}).length > 0 && (
                <GlassCard>
                  <SectionTitle badge="TREND">Monthly Revenue</SectionTitle>
                  {(() => {
                    const max = Math.max(...Object.values(data.monthly_trend))
                    return Object.entries(data.monthly_trend).map(([month, val]) => (
                      <BarRow key={month} label={month} value={val} max={max} color={theme.accent} />
                    ))
                  })()}
                </GlassCard>
              )}
            </div>
          )}
          {page === 'dashboard' && data?.error && (
            <GlassCard><p style={{ color: theme.red }}>❌ {data.error}</p></GlassCard>
          )}

          {/* INSIGHTS PAGE */}
          {page === 'insights' && data && !data.error && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <SectionTitle badge="GEMINI AI">AI-Generated Insights</SectionTitle>
              {(data.insights || []).map((insight, i) => {
                const colors = [theme.accent, theme.green, theme.amber]
                const color = colors[i] || theme.accent
                return (
                  <div key={i} style={{
                    ...styles.card,
                    borderLeft: `3px solid ${color}`,
                    boxShadow: `${cardGlow}, -2px 0 20px ${color}22`,
                    animation: `fadeIn ${0.3 + i * 0.1}s ease`,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 15, fontWeight: 700 }}>{insight.title}</span>
                      <span style={{
                        fontSize: 9, padding: '3px 8px', borderRadius: 4, fontFamily: 'monospace',
                        background: `${color}22`, color, border: `1px solid ${color}44`, letterSpacing: '1px',
                      }}>{insight.type?.toUpperCase()}</span>
                      <span style={{
                        fontSize: 9, padding: '3px 8px', borderRadius: 4, fontFamily: 'monospace',
                        background: 'rgba(255,255,255,0.05)', color: theme.text3,
                      }}>{insight.confidence}% CONFIDENCE</span>
                    </div>
                    <p style={{ fontSize: 13, color: theme.text2, lineHeight: 1.8 }}>{insight.body}</p>
                  </div>
                )
              })}
            </div>
          )}
          {page === 'insights' && data?.error && (
            <GlassCard><p style={{ color: theme.red }}>❌ {data.error}</p></GlassCard>
          )}

          {/* ANOMALIES PAGE */}
          {page === 'anomalies' && data && !data.error && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <KPICard label="ANOMALIES FOUND" value={data.anomalies_found} color={theme.red} icon="⚠️" sub="Flagged by Isolation Forest" />
                <KPICard label="ROWS CHECKED" value={data.total_rows_checked?.toLocaleString()} color={theme.amber} icon="🔍" sub="Total records scanned" />
              </div>

              {data.severity_counts && (
                <GlassCard>
                  <SectionTitle badge="SEVERITY">Breakdown</SectionTitle>
                  {Object.entries(data.severity_counts).map(([sev, count]) => {
                    const color = sev === 'high' ? theme.red : sev === 'medium' ? theme.amber : theme.green
                    return <BarRow key={sev} label={sev.toUpperCase()} value={count} max={data.anomalies_found} color={color} />
                  })}
                </GlassCard>
              )}

              {(data.anomaly_records || []).length > 0 && (
                <GlassCard>
                  <SectionTitle badge="FLAGGED">Anomaly Records</SectionTitle>
                  {data.anomaly_records.slice(0, 8).map((row, i) => {
                    const color = row._severity === 'high' ? theme.red : row._severity === 'medium' ? theme.amber : theme.green
                    return (
                      <div key={i} style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 0', borderBottom: `1px solid ${theme.border}`,
                        animation: `slideIn ${0.1 + i * 0.05}s ease`,
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, boxShadow: `0 0 8px ${color}` }} />
                        <span style={{ fontSize: 11, color, fontFamily: 'monospace', minWidth: 60 }}>{row._severity?.toUpperCase()}</span>
                        <span style={{ fontSize: 11, color: theme.text3, fontFamily: 'monospace' }}>score: {row._anomaly_score?.toFixed(4)}</span>
                      </div>
                    )
                  })}
                </GlassCard>
              )}
            </div>
          )}
          {page === 'anomalies' && data?.error && (
            <GlassCard><p style={{ color: theme.red }}>❌ {data.error}</p></GlassCard>
          )}

          {/* CHAT PAGE */}
          {page === 'chat' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <SectionTitle badge="GEMINI AI">Ask Your Data</SectionTitle>
              <GlassCard>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askChat()}
                    placeholder='e.g. "What is the total revenue?" or "Which product sold most?"'
                    style={{
                      flex: 1, background: 'rgba(255,255,255,0.03)',
                      border: `1px solid ${theme.border}`, borderRadius: 10,
                      padding: '12px 16px', color: theme.text, fontSize: 13, outline: 'none',
                      transition: 'border-color 0.2s',
                      fontFamily: 'inherit',
                    }}
                    onFocus={e => e.target.style.borderColor = theme.accent}
                    onBlur={e => e.target.style.borderColor = theme.border}
                  />
                  <button onClick={askChat} style={{
                    background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
                    border: 'none', borderRadius: 10, color: '#fff',
                    padding: '12px 24px', cursor: 'pointer', fontSize: 13,
                    fontWeight: 600, boxShadow: glow(theme.accent),
                    transition: 'transform 0.1s',
                  }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >Ask →</button>
                </div>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
                  {['What is the total revenue?', 'Which product sold most?', 'Summarize this dataset'].map(q => (
                    <button key={q} onClick={() => setQuestion(q)} style={{
                      fontSize: 11, padding: '5px 10px', borderRadius: 6,
                      background: 'rgba(108,99,255,0.08)', border: `1px solid ${theme.border}`,
                      color: theme.text2, cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = theme.accent}
                      onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                    >{q}</button>
                  ))}
                </div>

                {chatAnswer && (
                  <div style={{
                    background: 'rgba(108,99,255,0.05)',
                    border: `1px solid ${theme.border}`,
                    borderLeft: `3px solid ${theme.accent}`,
                    borderRadius: 10, padding: 16,
                    fontSize: 13, lineHeight: 1.8, color: theme.text2,
                    animation: 'fadeIn 0.3s ease',
                  }}>
                    <span style={{ color: theme.accent2, fontWeight: 600, marginRight: 8 }}>🤖 AI:</span>
                    {chatAnswer}
                  </div>
                )}
              </GlassCard>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}