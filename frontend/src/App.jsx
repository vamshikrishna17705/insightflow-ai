import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts'

const API_CANDIDATES = [
  'http://localhost:8000',
  import.meta.env.VITE_API_BASE_URL,
  'https://insightflow-ai-backend.onrender.com',
].filter(Boolean)

const theme = {
  bg: '#03030d',
  bg2: '#08081c',
  bg3: '#0f0f2d',
  card: 'rgba(255, 255, 255, 0.025)',
  cardHover: 'rgba(255, 255, 255, 0.05)',
  border: 'rgba(124, 58, 237, 0.15)',
  borderHover: 'rgba(217, 70, 239, 0.35)',
  accent: '#7c3aed', // Purple
  accent2: '#d946ef', // Pink
  cyan: '#06b6d4',
  green: '#10b981',
  red: '#ef4444',
  amber: '#f59e0b',
  blue: '#3b82f6',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
}

const cardGlow = '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.05)'
const accentGlow = (color) => `0 0 25px ${color}25, 0 0 60px ${color}10`

// Inline custom SVG Icons
const Icons = {
  Upload: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  Dashboard: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  ),
  Insights: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 0 1 7.54 16.59c-.43.5-.54 1.2-.3 1.83l.6 1.58H4.16l.6-1.58c.24-.63.13-1.33-.3-1.83A10 10 0 0 1 12 2z" />
      <line x1="10" y1="10" x2="14" y2="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
    </svg>
  ),
  Anomalies: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Forecast: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Segmentation: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Chat: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
}

function Orbs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', width: 700, height: 700,
        borderRadius: '50%', top: -250, right: -150,
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        animation: 'float1 14s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 600, height: 600,
        borderRadius: '50%', bottom: -100, left: -100,
        background: 'radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%)',
        animation: 'float2 16s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', width: 450, height: 450,
        borderRadius: '50%', top: '35%', left: '35%',
        background: 'radial-gradient(circle, rgba(217,70,239,0.05) 0%, transparent 70%)',
        animation: 'float3 18s ease-in-out infinite',
      }} />
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-50px,60px)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(60px,-50px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: ${theme.bg}; color: ${theme.text}; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124, 58, 237, 0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(124, 58, 237, 0.4); }
      `}</style>
    </div>
  )
}

function Logo() {
  return (
    <div style={{ padding: '24px 20px', borderBottom: `1px solid ${theme.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: accentGlow(theme.accent),
          color: '#fff'
        }}>⚡</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(90deg, #fff, #d946ef)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>InsightFlow AI</div>
          <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '2.5px', fontFamily: 'monospace', fontWeight: 600 }}>ADVANCED ANALYTICS</div>
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active, onClick, badge }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 16px', margin: '4px 12px',
      borderRadius: 12, cursor: 'pointer',
      background: active ? 'rgba(124, 58, 237, 0.12)' : 'transparent',
      border: active ? `1px solid rgba(124, 58, 237, 0.3)` : '1px solid transparent',
      color: active ? '#fff' : theme.textSecondary,
      fontSize: 13, fontWeight: active ? 600 : 500,
      transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: active ? accentGlow(theme.accent) : 'none',
    }}
      className="nav-item-hover"
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.color = theme.text
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.color = theme.textSecondary
          e.currentTarget.style.background = 'transparent'
        }
      }}>
      <span style={{ display: 'flex', alignItems: 'center', color: active ? theme.accent2 : 'inherit' }}><Icon /></span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          fontSize: 9, padding: '2px 6px', borderRadius: 6,
          background: 'rgba(217, 70, 239, 0.15)', color: theme.accent2,
          fontWeight: 700, fontFamily: 'monospace', border: `1px solid rgba(217, 70, 239, 0.25)`
        }}>{badge}</span>
      )}
    </div>
  )
}

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    setError('')
    setTimeout(() => {
      const success = onLogin(email.trim(), password)
      if (!success) {
        setError('Login failed. Please check your credentials.')
        setLoading(false)
      }
    }, 800)
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: theme.bg,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Orbs />
      
      {/* Glass Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.015)',
        border: `1px solid ${theme.border}`,
        borderRadius: 24,
        padding: 40,
        width: '100%',
        maxWidth: 400,
        backdropFilter: 'blur(24px)',
        boxShadow: cardGlow,
        zIndex: 10,
        animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Glowing Logo */}
        <div style={{
          width: 54, height: 54, borderRadius: 16,
          background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, marginBottom: 16, boxShadow: accentGlow(theme.accent),
          color: '#fff'
        }}>⚡</div>
        
        <h2 style={{
          fontSize: 24, fontWeight: 800,
          background: 'linear-gradient(90deg, #fff, #d946ef)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: 6,
          letterSpacing: '-0.5px'
        }}>
          InsightFlow AI
        </h2>
        
        <p style={{
          fontSize: 12, color: theme.textSecondary,
          marginBottom: 32, fontFamily: 'monospace',
          letterSpacing: '1px', textTransform: 'uppercase'
        }}>
          Secure Analytics Gate
        </p>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: `1px solid ${theme.red}30`,
            color: theme.red,
            fontSize: 12,
            padding: '10px 14px',
            borderRadius: 10,
            marginBottom: 20,
            width: '100%',
            textAlign: 'center',
            animation: 'fadeIn 0.2s ease',
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: theme.textSecondary, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Email Address</label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="e.g. name@company.com"
              disabled={loading}
              style={{
                width: '100%',
                background: theme.bg3,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: '12px 16px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = theme.accent
                e.target.style.boxShadow = `0 0 12px ${theme.accent}30`
              }}
              onBlur={e => {
                e.target.style.borderColor = theme.border
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: theme.textSecondary, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              style={{
                width: '100%',
                background: theme.bg3,
                border: `1px solid ${theme.border}`,
                borderRadius: 12,
                padding: '12px 16px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={e => {
                e.target.style.borderColor = theme.accent
                e.target.style.boxShadow = `0 0 12px ${theme.accent}30`
              }}
              onBlur={e => {
                e.target.style.borderColor = theme.border
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              padding: '14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: accentGlow(theme.accent2),
              marginTop: 10,
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
            onMouseEnter={e => {
              if (!loading) e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {loading ? (
              <span style={{
                display: 'inline-block',
                width: 14, height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #fff',
                borderRadius: '50%',
                animation: 'spin 0.5s linear infinite'
              }} />
            ) : 'ENTER WORKSPACE'}
          </button>
        </form>

        <div style={{ marginTop: 24, fontSize: 10, color: theme.textMuted, textAlign: 'center', letterSpacing: '0.2px' }}>
          Enter **any valid email** and **any password** (min. 6 characters) to access the workspace.
        </div>
      </div>
    </div>
  )
}

function KPICard({ label, value, color, description, icon }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: 24,
      position: 'relative',
      overflow: 'hidden',
      backdropFilter: 'blur(16px)',
      boxShadow: cardGlow,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'fadeIn 0.5s ease',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color + '66'
        e.currentTarget.style.boxShadow = `0 12px 40px ${color}15, ${cardGlow}`
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border
        e.currentTarget.style.boxShadow = cardGlow
        e.currentTarget.style.transform = 'translateY(0)'
      }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: theme.textMuted, letterSpacing: '1.5px', fontFamily: 'monospace', fontWeight: 600 }}>{label.toUpperCase()}</span>
        <span style={{ fontSize: 20, color, opacity: 0.8 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: 6, textShadow: `0 0 30px ${color}33` }}>{value}</div>
      {description && <div style={{ fontSize: 11, color: theme.textSecondary }}>{description}</div>}
    </div>
  )
}

function GlassCard({ children, style = {}, accent, title, badge }) {
  return (
    <div style={{
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: 20,
      padding: 24,
      backdropFilter: 'blur(16px)',
      boxShadow: cardGlow,
      transition: 'border-color 0.3s',
      animation: 'fadeIn 0.4s ease',
      position: 'relative',
      ...style,
    }}
      onMouseEnter={e => {
        if (accent) e.currentTarget.style.borderColor = accent + '55'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border
      }}>
      {title && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.5px' }}>{title}</div>
          {badge && (
            <span style={{
              fontSize: 9, padding: '2px 8px', borderRadius: 6,
              background: 'rgba(124, 58, 237, 0.12)', color: theme.accent2,
              border: `1px solid rgba(124, 58, 237, 0.2)`,
              fontFamily: 'monospace', letterSpacing: '0.5px', fontWeight: 600
            }}>{badge}</span>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

const COLORS = [theme.accent, theme.cyan, theme.accent2, theme.green, theme.amber, theme.blue, theme.red]

function ChatMessage({ text, sender, isMobile }) {
  const isAi = sender === 'ai'
  
  // Try to parse JSON codeblock from text
  const jsonRegex = /```json\s*([\s\S]*?)\s*```/
  const match = text.match(jsonRegex)
  
  let docData = null
  let textBefore = text
  let textAfter = ''
  
  if (match) {
    try {
      docData = JSON.parse(match[1])
      const parts = text.split(match[0])
      textBefore = parts[0]
      textAfter = parts[1] || ''
    } catch (e) {
      // not valid json
    }
  }

  const handlePrint = (e) => {
    e.stopPropagation()
    const win = window.open('', '_blank')
    win.document.write(`
      <html>
        <head>
          <title>${docData?.title || 'Document'}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; padding: 40px; background-color: #fff; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; margin-bottom: 24px; }
            th, td { border-bottom: 1px solid #e2e8f0; padding: 12px; text-align: left; }
            th { background-color: #f8fafc; color: #475569; font-weight: 700; font-size: 11px; letter-spacing: 0.5px; }
            td { font-size: 13px; color: #1e293b; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 24px; margin-bottom: 24px; }
            .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: 24px; font-size: 13px; }
            .totals-row { display: flex; gap: 40px; }
            .grand-total { font-size: 16px; font-weight: 800; border-top: 2px double #cbd5e1; padding-top: 8px; margin-top: 4px; color: #7c3aed; }
            .section { margin-top: 24px; border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px; background: #f8fafc; }
            .section-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
            .section-text { font-size: 12px; color: #475569; line-height: 1.6; }
            .notes { margin-top: 40px; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px; font-style: italic; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0;">${docData?.company_name || ''}</h1>
              <div style="font-size: 12px; color: #64748b; margin-top: 4px;">${docData?.company_address || ''}</div>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 18px; font-weight: 800; color: #7c3aed; margin: 0;">${docData?.title || 'DOCUMENT'}</h2>
              <div style="font-size: 12px; color: #64748b; font-family: monospace; margin-top: 4px;">No: ${docData?.invoice_number || ''}</div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px;">
            <div>
              <div style="font-size: 10px; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px;">BILL TO</div>
              <div style="font-size: 13px; font-weight: 700; color: #0f172a;">${docData?.customer_name || ''}</div>
              ${docData?.customer_id ? `<div style="font-size: 12px; color: #64748b; font-family: monospace;">ID: ${docData.customer_id}</div>` : ''}
              ${docData?.customer_address ? `<div style="font-size: 12px; color: #64748b;">${docData.customer_address}</div>` : ''}
            </div>
            <div style="text-align: right;">
              <div style="font-size: 10px; color: #94a3b8; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 6px;">DATE & TERMS</div>
              <div style="font-size: 12px; color: #1e293b;">Date: ${docData?.date || ''}</div>
              ${docData?.due_date ? `<div style="font-size: 12px; color: #1e293b;">Due Date: ${docData.due_date}</div>` : ''}
            </div>
          </div>

          ${docData?.document_type === 'financial_report' ? `
            ${docData.financial_metrics ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                <div style="border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; background: #f8fafc; text-align: center;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Income</div>
                  <div style="font-size: 18px; font-weight: 800; color: #10b981; margin-top: 4px;">$${docData.financial_metrics.total_income?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div style="border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; background: #f8fafc; text-align: center;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Expenses</div>
                  <div style="font-size: 18px; font-weight: 800; color: #ef4444; margin-top: 4px;">$${docData.financial_metrics.total_expenses?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div style="border: 1px solid #cbd5e1; padding: 12px; border-radius: 8px; background: #f8fafc; text-align: center;">
                  <div style="font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase;">Net Margin</div>
                  <div style="font-size: 18px; font-weight: 800; color: #7c3aed; margin-top: 4px;">${docData.financial_metrics.net_margin}%</div>
                </div>
              </div>
              ${docData.financial_metrics.advice_block ? `
                <div style="border-left: 4px solid #7c3aed; padding: 14px 18px; background: #faf5ff; border-radius: 0 12px 12px 0; margin-bottom: 24px; font-size: 12.5px; color: #581c87; line-height: 1.5;">
                  <strong>AI Advice:</strong> ${docData.financial_metrics.advice_block}
                </div>
              ` : ''}
            ` : ''}
            <div style="display: flex; flex-direction: column; gap: 16px;">
              ${docData.report_sections?.map(sec => `
                <div class="section">
                  <div class="section-title">${sec.heading}</div>
                  <div class="section-text">${sec.content}</div>
                </div>
              `).join('')}
            </div>
          ` : `
            <table>
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th style="text-align: center;">QTY</th>
                  <th style="text-align: right;">PRICE</th>
                  <th style="text-align: right;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${docData?.items?.map(item => `
                  <tr>
                    <td style="font-weight: 700;">${item.description}</td>
                    <td style="text-align: center; font-family: monospace;">${item.quantity}</td>
                    <td style="text-align: right; font-family: monospace;">$${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style="text-align: right; font-family: monospace; font-weight: 700; color: #7c3aed;">$${item.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row">
                <span style="color: #64748b;">Subtotal:</span>
                <span style="font-family: monospace; font-weight: 700; width: 100px; text-align: right;">$${docData?.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              ${docData?.tax_amount > 0 ? `
                <div class="totals-row">
                  <span style="color: #64748b;">Tax (${docData.tax_rate}%):</span>
                  <span style="font-family: monospace; font-weight: 700; width: 100px; text-align: right;">$${docData.tax_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ` : ''}
              ${docData?.discount > 0 ? `
                <div class="totals-row">
                  <span style="color: #64748b;">Discount:</span>
                  <span style="font-family: monospace; font-weight: 700; width: 100px; text-align: right; color: #10b981;">-$${docData.discount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              ` : ''}
              <div class="totals-row grand-total">
                <span>Grand Total:</span>
                <span style="font-family: monospace; width: 100px; text-align: right;">$${docData?.grand_total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          `}

          ${docData?.notes ? `<div class="notes">Note: ${docData.notes}</div>` : ''}
        </body>
      </html>
    `)
    win.document.close()
  }

  const handleDownloadCSV = (e) => {
    e.stopPropagation()
    let csvContent = ""
    if (docData.document_type === 'financial_report') {
      csvContent += "Financial Report Summary\n"
      csvContent += `Title,"${docData.title || ''}"\n`
      csvContent += `Report ID,"${docData.invoice_number || ''}"\n`
      csvContent += `Date,"${docData.date || ''}"\n\n`
      
      if (docData.financial_metrics) {
        csvContent += "Key Financial Metrics\n"
        csvContent += `Total Income,${docData.financial_metrics.total_income || 0}\n`
        csvContent += `Total Expenses,${docData.financial_metrics.total_expenses || 0}\n`
        csvContent += `Net Margin %,${docData.financial_metrics.net_margin || 0}%\n\n`
      }
      
      csvContent += "Report Sections\n"
      csvContent += "Heading,Content\n"
      docData.report_sections?.forEach(sec => {
        csvContent += `"${(sec.heading || '').replace(/"/g, '""')}","${(sec.content || '').replace(/"/g, '""')}"\n`
      })
    } else {
      csvContent += "Invoice Metadata\n"
      csvContent += `Document Title,"${docData.title || ''}"\n`
      csvContent += `Invoice Number,"${docData.invoice_number || ''}"\n`
      csvContent += `Date,"${docData.date || ''}"\n`
      csvContent += `Customer ID,"${docData.customer_id || ''}"\n`
      csvContent += `Customer Name,"${docData.customer_name || ''}"\n\n`
      
      csvContent += "Line Items\n"
      csvContent += "Description,Quantity,Unit Price,Total\n"
      docData.items?.forEach(item => {
        csvContent += `"${(item.description || '').replace(/"/g, '""')}",${item.quantity || 0},${item.price || 0},${item.total || 0}\n`
      })
      csvContent += "\nTotals\n"
      csvContent += `Subtotal,${docData.subtotal || 0}\n`
      csvContent += `Tax Rate %,${docData.tax_rate || 0}\n`
      csvContent += `Tax Amount,${docData.tax_amount || 0}\n`
      csvContent += `Discount,${docData.discount || 0}\n`
      csvContent += `Grand Total,${docData.grand_total || 0}\n`
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${docData.invoice_number || 'document'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div style={{
      alignSelf: isAi ? 'flex-start' : 'flex-end',
      maxWidth: '90%',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      animation: 'fadeIn 0.2s ease',
      width: docData ? '100%' : 'auto'
    }}>
      {/* Text before the document JSON code block */}
      {(textBefore.trim() || !docData) && (
        <div style={{
          background: isAi ? 'rgba(124, 58, 237, 0.08)' : 'rgba(217, 70, 239, 0.12)',
          border: `1px solid ${isAi ? theme.border : 'rgba(217, 70, 239, 0.25)'}`,
          borderLeft: isAi ? `3px solid ${theme.accent}` : `3px solid ${theme.accent2}`,
          borderRadius: 14, padding: '14px 18px',
          fontSize: 13, lineHeight: 1.6, color: '#fff',
        }}>
          <div style={{ fontSize: 10, color: isAi ? theme.accent2 : theme.cyan, fontWeight: 700, fontFamily: 'monospace', marginBottom: 4 }}>
            {isAi ? '🤖 GEMINI AI' : '👤 USER'}
          </div>
          {textBefore}
        </div>
      )}

      {/* Render beautiful interactive Invoice/Bill component */}
      {docData && (
        <div style={{
          background: theme.bg3,
          border: `1px solid ${theme.border}`,
          borderRadius: 20,
          boxShadow: cardGlow,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(16px)',
        }}
          onMouseEnter={e => e.currentTarget.style.borderColor = theme.borderHover}
          onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
        >
          {/* Action Header */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            padding: '12px 20px',
            borderBottom: `1px solid ${theme.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: theme.accent2, fontFamily: 'monospace' }}>
              📄 {docData.title?.toUpperCase()}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleDownloadCSV}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${theme.border}`,
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                📥 Download CSV
              </button>
              <button
                onClick={handlePrint}
                style={{
                  background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                  border: 'none',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: 8,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontWeight: 600,
                  boxShadow: accentGlow(theme.accent)
                }}
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>

          {/* Printable container */}
          <div id={`print-area-${docData.invoice_number || 'doc'}`} style={{ padding: 24, background: 'rgba(0,0,0,0.2)' }}>
            
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#fff', marginBottom: 4 }}>{docData.company_name}</h4>
                <div style={{ fontSize: 11, color: theme.textSecondary }}>{docData.company_address}</div>
              </div>
              <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: theme.accent2 }}>{docData.title}</h3>
                <div style={{ fontSize: 11, color: theme.textSecondary, fontFamily: 'monospace', marginTop: 4 }}>
                  No: {docData.invoice_number}
                </div>
              </div>
            </div>

            {/* Billing fields */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24, borderTop: `1px dashed ${theme.border}`, paddingTop: 16 }}>
              <div>
                <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '0.5px', marginBottom: 4, fontFamily: 'monospace', fontWeight: 700 }}>BILL TO</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{docData.customer_name}</div>
                {docData.customer_id && <div style={{ fontSize: 11, color: theme.textSecondary, fontFamily: 'monospace' }}>ID: {docData.customer_id}</div>}
                {docData.customer_address && <div style={{ fontSize: 11, color: theme.textSecondary }}>{docData.customer_address}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '0.5px', marginBottom: 4, fontFamily: 'monospace', fontWeight: 700 }}>DATE & TERMS</div>
                <div style={{ fontSize: 11, color: '#fff' }}>Date: <span style={{ fontFamily: 'monospace' }}>{docData.date}</span></div>
                {docData.due_date && <div style={{ fontSize: 11, color: '#fff' }}>Due: <span style={{ fontFamily: 'monospace' }}>{docData.due_date}</span></div>}
              </div>
            </div>

            {/* Items or Sections */}
            {docData.document_type === 'financial_report' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Dynamic Balance Metrics cards */}
                {docData.financial_metrics && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: `1px solid ${theme.border}`,
                      borderRadius: 14,
                      padding: 16,
                      textAlign: 'center',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.02)',
                    }}>
                      <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '1px', fontWeight: 700, fontFamily: 'monospace' }}>TOTAL INCOME</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: theme.green, marginTop: 6 }}>
                        ${docData.financial_metrics.total_income?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: `1px solid ${theme.border}`,
                      borderRadius: 14,
                      padding: 16,
                      textAlign: 'center',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.02)',
                    }}>
                      <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '1px', fontWeight: 700, fontFamily: 'monospace' }}>TOTAL EXPENSES</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: theme.red, marginTop: 6 }}>
                        ${docData.financial_metrics.total_expenses?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.015)',
                      border: `1px solid ${theme.border}`,
                      borderRadius: 14,
                      padding: 16,
                      textAlign: 'center',
                      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.02)',
                    }}>
                      <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '1px', fontWeight: 700, fontFamily: 'monospace' }}>NET MARGIN</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: theme.accent2, marginTop: 6 }}>
                        {docData.financial_metrics.net_margin}%
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Advice block */}
                {docData.financial_metrics?.advice_block && (
                  <div style={{
                    background: 'rgba(124, 58, 237, 0.04)',
                    border: `1px solid rgba(124, 58, 237, 0.25)`,
                    borderLeft: `4px solid ${theme.accent}`,
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 12,
                    lineHeight: 1.6,
                    color: theme.text,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: theme.accent2, fontSize: 10, fontFamily: 'monospace', marginBottom: 4 }}>
                      🤖 AI RECOMMENDATION
                    </div>
                    {docData.financial_metrics.advice_block}
                  </div>
                )}

                {/* Sections */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {docData.report_sections?.map((sec, sIdx) => (
                    <div key={sIdx} style={{ background: 'rgba(255, 255, 255, 0.01)', padding: 16, borderRadius: 12, border: `1px solid ${theme.border}` }}>
                      <h5 style={{ fontSize: 12, fontWeight: 700, color: theme.cyan, marginBottom: 6 }}>{sec.heading}</h5>
                      <p style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>{sec.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: 20 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${theme.border}`, fontSize: 10, color: theme.textMuted, fontFamily: 'monospace' }}>
                      <th style={{ padding: '8px 4px' }}>DESCRIPTION</th>
                      <th style={{ padding: '8px 4px', textAlign: 'center' }}>QTY</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>PRICE</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docData.items?.map((item, itemIdx) => (
                      <tr key={itemIdx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
                        <td style={{ padding: '12px 4px', fontWeight: 600 }}>{item.description}</td>
                        <td style={{ padding: '12px 4px', textAlign: 'center', fontFamily: 'monospace' }}>{item.quantity}</td>
                        <td style={{ padding: '12px 4px', textAlign: 'right', fontFamily: 'monospace' }}>${item.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: '12px 4px', textAlign: 'right', fontFamily: 'monospace', color: theme.accent2 }}>${item.total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Subtotals & Grand totals */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
                    <span style={{ color: theme.textSecondary }}>Subtotal:</span>
                    <span style={{ fontFamily: 'monospace', minWidth: 90, textAlign: 'right' }}>${docData.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                  {docData.tax_amount > 0 && (
                    <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
                      <span style={{ color: theme.textSecondary }}>Tax ({docData.tax_rate}%):</span>
                      <span style={{ fontFamily: 'monospace', minWidth: 90, textAlign: 'right' }}>${docData.tax_amount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {docData.discount > 0 && (
                    <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
                      <span style={{ color: theme.textSecondary }}>Discount:</span>
                      <span style={{ fontFamily: 'monospace', minWidth: 90, textAlign: 'right', color: theme.green }}>-${docData.discount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 20, fontSize: 14, fontWeight: 800, borderTop: `1px double ${theme.border}`, paddingTop: 8, marginTop: 4 }}>
                    <span style={{ color: theme.accent2 }}>Grand Total:</span>
                    <span style={{ fontFamily: 'monospace', minWidth: 90, textAlign: 'right', color: theme.accent2 }}>${docData.grand_total?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </>
            )}

            {/* Notes footer */}
            {docData.notes && (
              <div style={{ marginTop: 24, fontSize: 10, color: theme.textMuted, borderTop: `1px solid rgba(255,255,255,0.04)`, paddingTop: 12, fontStyle: 'italic' }}>
                Note: {docData.notes}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text after the JSON block */}
      {textAfter.trim() && (
        <div style={{
          background: 'rgba(124, 58, 237, 0.08)',
          border: `1px solid ${theme.border}`,
          borderLeft: `3px solid ${theme.accent}`,
          borderRadius: 14, padding: '14px 18px',
          fontSize: 13, lineHeight: 1.6, color: '#fff',
        }}>
          {textAfter}
        </div>
      )}
    </div>
  )
}

const extractUsername = (email) => {
  if (!email) return 'User'
  const localPart = email.split('@')[0]
  const cleanPart = localPart.replace(/[\._\-]+/g, ' ')
  const formatted = cleanPart
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
  return formatted || 'User'
}

const getInitials = (name) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 1).toUpperCase()
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null
    } catch {
      return null
    }
  })

  const handleLogin = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email.trim()) && password.length >= 6) {
      const username = extractUsername(email)
      const userData = { username, email: email.trim(), loginTime: new Date().toISOString() }
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('user', JSON.stringify(userData))
      setIsLoggedIn(true)
      setUser(userData)
      return true
    }
    return false
  }

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    setUser(null)
  }

  const [apiBase, setApiBase] = useState(API_CANDIDATES[0])
  const [datasetId, setDatasetId] = useState(localStorage.getItem('dataset_id') || '')
  
  // Navigation Page
  const [page, setPage] = useState('upload')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [backendLive, setBackendLive] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Page Specific Cached States
  const [dashboardData, setDashboardData] = useState(null)
  const [insightsData, setInsightsData] = useState(null)
  const [anomalyData, setAnomalyData] = useState(null)
  
  // Dashboard Specific Variables
  const [dashMetric, setDashMetric] = useState('')
  
  // Anomalies Specific Filters
  const [anomalySearch, setAnomalySearch] = useState('')
  const [anomalySevFilter, setAnomalySevFilter] = useState('all')

  // Forecast Specific States
  const [foreCol, setForeCol] = useState('')
  const [forePeriods, setForePeriods] = useState(6)
  const [forecastData, setForecastData] = useState(null)
  const [foreLoading, setForeLoading] = useState(false)

  // Customer Segmentation Specific States
  const [segFeatures, setSegFeatures] = useState([])
  const [segK, setSegK] = useState(5)
  const [segmentationData, setSegmentationData] = useState(null)
  const [segLoading, setSegLoading] = useState(false)

  // Chat/Ask Data States
  const [question, setQuestion] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { sender: 'ai', text: 'Hello! I am Gemini. Ask me any question about your loaded dataset, and I will analyze the metrics for you.' }
  ])

  // Probe Backend Node Services
  useEffect(() => {
    let active = true
    const probeBackends = async () => {
      for (const base of API_CANDIDATES) {
        try {
          await axios.get(base + '/', { timeout: 8000 })
          if (!active) return
          setApiBase(base)
          setBackendLive(true)
          return
        } catch {
          // Try next
        }
      }
      if (active) setBackendLive(false)
    }

    probeBackends()
    const interval = setInterval(probeBackends, 20000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false)
  }, [isMobile])

  // If a dataset is loaded and we change page, load its data dynamically
  const clearCache = () => {
    setDashboardData(null)
    setInsightsData(null)
    setAnomalyData(null)
    setForecastData(null)
    setSegmentationData(null)
    setDashMetric('')
    setForeCol('')
    setSegFeatures([])
  }

  const uploadFile = async (file) => {
    if (!file) return
    setLoading(true)
    setError('')
    clearCache()
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await axios.post(apiBase + '/api/upload/', form)
      const id = res.data.dataset_id
      setDatasetId(id)
      localStorage.setItem('dataset_id', id)
      setBackendLive(true)
      // Redirect and fetch dashboard
      handleNav('dashboard', id)
    } catch {
      setError('File upload failed. Ensure that the backend server is running.')
    }
    setLoading(false)
  }

  const handleFileInput = (e) => uploadFile(e.target.files?.[0])
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    uploadFile(e.dataTransfer.files?.[0])
  }

  const loadSampleDataset = async () => {
    setLoading(true)
    setError('')
    clearCache()
    try {
      const res = await axios.post(apiBase + '/api/upload/sample')
      const id = res.data.dataset_id
      setDatasetId(id)
      localStorage.setItem('dataset_id', id)
      setBackendLive(true)
      handleNav('dashboard', id)
    } catch {
      setError('Could not load sample dataset. Verify your server connection.')
    }
    setLoading(false)
  }

  // Master Navigation Controller with caching
  const handleNav = async (targetPage, customId = null) => {
    const activeId = customId || datasetId
    if (!activeId && targetPage !== 'upload') return
    setPage(targetPage)
    setSidebarOpen(false)
    setError('')

    if (targetPage === 'dashboard' && !dashboardData) {
      setLoading(true)
      try {
        const res = await axios.get(`${apiBase}/api/dashboard/${activeId}`)
        if (res.data.error) {
          setError(res.data.error)
        } else {
          setDashboardData(res.data)
          if (res.data.numeric_columns?.length > 0) {
            setDashMetric(res.data.numeric_columns[0])
          }
        }
      } catch {
        setError('Failed to fetch dashboard metrics.')
      }
      setLoading(false)
    } else if (targetPage === 'insights' && !insightsData) {
      setLoading(true)
      try {
        const res = await axios.get(`${apiBase}/api/insights/${activeId}`)
        if (res.data.error) {
          setError(res.data.error)
        } else {
          setInsightsData(res.data)
        }
      } catch {
        setError('Failed to fetch AI insights.')
      }
      setLoading(false)
    } else if (targetPage === 'anomalies' && !anomalyData) {
      setLoading(true)
      try {
        const res = await axios.get(`${apiBase}/api/anomaly/${activeId}`)
        if (res.data.error) {
          setError(res.data.error)
        } else {
          setAnomalyData(res.data)
        }
      } catch {
        setError('Failed to fetch anomaly records.')
      }
      setLoading(false)
    } else if (targetPage === 'forecast') {
      const availableCols = dashboardData?.numeric_columns || []
      if (availableCols.length > 0) {
        const defaultCol = foreCol || availableCols[0]
        setForeCol(defaultCol)
        if (!forecastData) {
          runForecast(defaultCol, forePeriods, activeId)
        }
      }
    } else if (targetPage === 'segmentation') {
      const availableCols = dashboardData?.numeric_columns || []
      if (availableCols.length > 0) {
        const defaultCols = segFeatures.length > 0 ? segFeatures : availableCols.slice(0, 3)
        setSegFeatures(defaultCols)
        if (!segmentationData) {
          runSegmentation(defaultCols, segK, activeId)
        }
      }
    }
  }

  // Trigger Forecasting
  const runForecast = async (col, periods, activeId = datasetId) => {
    setForeLoading(true)
    setError('')
    try {
      const res = await axios.post(`${apiBase}/api/forecast/${activeId}`, {
        target_col: col,
        periods: parseInt(periods)
      })
      if (res.data.error) {
        setError(res.data.error)
      } else {
        setForecastData(res.data)
      }
    } catch {
      setError('Forecasting failed. XGBoost model error.')
    }
    setForeLoading(false)
  }

  // Trigger Customer Segmentation (Clustering)
  const runSegmentation = async (features, k, activeId = datasetId) => {
    setSegLoading(true)
    setError('')
    try {
      const res = await axios.post(`${apiBase}/api/segmentation/${activeId}`, {
        features,
        k: parseInt(k)
      })
      if (res.data.error) {
        setError(res.data.error)
      } else {
        setSegmentationData(res.data)
      }
    } catch {
      setError('Segmentation failed. Clustering algorithm failure.')
    }
    setSegLoading(false)
  }

  // Chat Data Request
  const askChat = async (presetQuestion = '') => {
    const qText = presetQuestion || question
    if (!qText.trim()) return

    // Add user message
    setChatHistory(prev => [...prev, { sender: 'user', text: qText }])
    if (!presetQuestion) setQuestion('')

    setLoading(true)
    try {
      const res = await axios.post(`${apiBase}/api/insights/chat`, {
        dataset_id: datasetId,
        question: qText
      })
      setChatHistory(prev => [...prev, { sender: 'ai', text: res.data.answer }])
    } catch {
      setChatHistory(prev => [...prev, { sender: 'ai', text: 'Error: Could not retrieve answers. Please check server.' }])
    }
    setLoading(false)
  }

  // Helper: Create Combined Time-Series Forecast data for Recharts
  const getCombinedForecastData = () => {
    if (!dashboardData || !forecastData) return []
    const hist = dashboardData.monthly_trend?.data || []
    const combined = []

    if (hist.length > 0) {
      // Add historical actuals
      hist.forEach(d => {
        combined.push({
          name: d.month,
          actual: d[foreCol],
        })
      })

      // Determine starting date offsets
      let lastMonthStr = hist[hist.length - 1].month
      let year = parseInt(lastMonthStr.split('-')[0])
      let month = parseInt(lastMonthStr.split('-')[1])

      const preds = forecastData.predictions || []
      const lower = forecastData.lower_bound || []
      const upper = forecastData.upper_bound || []

      preds.forEach((p, idx) => {
        month++
        if (month > 12) {
          month = 1
          year++
        }
        const monthStr = `${year}-${String(month).padStart(2, '0')}`
        combined.push({
          name: monthStr,
          prediction: p,
          // Using range syntax to fill transparent bounds
          range: [lower[idx], upper[idx]]
        })
      })
    } else {
      // Fallback: Use sequential observation indexing for datasets without date columns
      const actuals = forecastData.actuals || []
      actuals.forEach((val, idx) => {
        combined.push({
          name: `Obs ${idx + 1}`,
          actual: val,
        })
      })

      const preds = forecastData.predictions || []
      const lower = forecastData.lower_bound || []
      const upper = forecastData.upper_bound || []

      preds.forEach((p, idx) => {
        combined.push({
          name: `Forecast ${idx + 1}`,
          prediction: p,
          range: [lower[idx], upper[idx]]
        })
      })
    }

    return combined
  }

  const forecastChartData = getCombinedForecastData()

  // Navigation Items
  const nav = [
    { id: 'upload', icon: Icons.Upload, label: 'Upload' },
    { id: 'dashboard', icon: Icons.Dashboard, label: 'Dashboard' },
    { id: 'insights', icon: Icons.Insights, label: 'AI Insights', badge: 'GEMINI' },
    { id: 'anomalies', icon: Icons.Anomalies, label: 'Anomalies' },
    { id: 'forecast', icon: Icons.Forecast, label: 'Forecasting' },
    { id: 'segmentation', icon: Icons.Segmentation, label: 'Segments' },
    { id: 'chat', icon: Icons.Chat, label: 'Ask Data' },
  ]

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, color: theme.text }}>
      <Orbs />

      {/* Mobile Drawer Backdrop */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(2, 2, 8, 0.75)',
            backdropFilter: 'blur(4px)',
            zIndex: 90,
          }}
        />
      )}

      {/* Sidebar navigation */}
      <div style={{
        position: 'fixed',
        left: 0, top: 0, bottom: 0,
        width: 250,
        background: 'rgba(8, 8, 28, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transform: isMobile ? (sidebarOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Logo />

        <div style={{ padding: '24px 0', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: 9, color: theme.textMuted, letterSpacing: '2px', padding: '0 28px', marginBottom: 12, fontFamily: 'monospace', fontWeight: 700 }}>WORKSPACE</div>
          {nav.map(n => (
            <NavItem
              key={n.id}
              icon={n.icon}
              label={n.label}
              badge={n.badge}
              active={page === n.id}
              onClick={() => handleNav(n.id)}
            />
          ))}
        </div>

        {/* User Card */}
        <div style={{ padding: '20px 24px', borderTop: `1px solid ${theme.border}`, background: 'rgba(255, 255, 255, 0.01)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, #10b981, #3b82f6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: '#000',
                boxShadow: accentGlow(theme.blue),
              }}>{getInitials(user?.username)}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.username || 'Admin'}</div>
                <div style={{ fontSize: 10, color: theme.textMuted }}>InsightFlow Pro</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out"
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${theme.red}30`,
                color: theme.red,
                borderRadius: 8,
                width: 28, height: 28,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                e.currentTarget.style.borderColor = theme.red
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                e.currentTarget.style.borderColor = `${theme.red}30`
              }}
            >
              🚪
            </button>
          </div>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? 0 : 250,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top bar header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          height: 70,
          background: 'rgba(3, 3, 13, 0.65)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', alignItems: 'center',
          padding: isMobile ? '0 16px' : '0 40px',
          gap: 16,
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(prev => !prev)}
                style={{
                  background: 'rgba(124, 58, 237, 0.1)',
                  border: `1px solid ${theme.border}`,
                  color: '#fff',
                  borderRadius: 10,
                  width: 38,
                  height: 38,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 18,
                  transition: 'background 0.2s',
                }}
              >☰</button>
            )}
            <h1 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '0.2px' }}>
              {page === 'upload' && '📤 Upload Dataset'}
              {page === 'dashboard' && '📊 Dashboard Metrics'}
              {page === 'insights' && '🤖 AI Insights Report'}
              {page === 'anomalies' && '🚨 Outliers & Anomalies'}
              {page === 'forecast' && '📈 Time-Series Forecasting'}
              {page === 'segmentation' && '👥 Customer Segmentation'}
              {page === 'chat' && '💬 Ask Your Data'}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {datasetId && (
              <div style={{
                fontSize: 10, fontFamily: 'monospace', color: theme.textSecondary,
                background: 'rgba(124, 58, 237, 0.08)', border: `1px solid ${theme.border}`,
                padding: '5px 12px', borderRadius: 8,
                maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
              }}>
                id: {datasetId}
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: backendLive ? theme.green : theme.red,
                boxShadow: backendLive ? `0 0 10px ${theme.green}` : `0 0 10px ${theme.red}`,
                animation: backendLive ? 'pulse 2s infinite' : 'none',
              }} />
              <span style={{ fontSize: 10, color: backendLive ? theme.green : theme.red, fontFamily: 'monospace', fontWeight: 700 }}>
                {backendLive ? 'LIVE' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Loading Spinner / Blur Overlay */}
        {loading && (
          <div style={{
            position: 'fixed', top: 70, left: isMobile ? 0 : 250, right: 0, bottom: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(3, 3, 13, 0.65)', backdropFilter: 'blur(4px)',
            zIndex: 200,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 52, height: 52, border: `2px solid ${theme.border}`,
                borderTop: `2px solid ${theme.accent2}`, borderRadius: '50%',
                animation: 'spin 0.75s linear infinite', margin: '0 auto 16px',
              }} />
              <div style={{ color: theme.textSecondary, fontSize: 12, fontFamily: 'monospace', letterSpacing: '1px' }}>PROCESSING METRICS...</div>
            </div>
          </div>
        )}

        {/* Main Content Area Grid Container */}
        <div style={{
          padding: isMobile ? '24px 16px' : '40px',
          flex: 1,
          maxWidth: 1400,
          width: '100%',
          margin: '0 auto',
        }}>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${theme.red}40`,
              color: theme.red, fontSize: 13, borderRadius: 14, padding: '16px 20px',
              marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 500, animation: 'fadeIn 0.3s ease'
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* PAGE: UPLOAD */}
          {page === 'upload' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Upload Your Dataset</h2>
                <p style={{ fontSize: 14, color: theme.textSecondary, maxWidth: 600, margin: '0 auto' }}>
                  Drop your CSV, Excel, TSV, JSON, Parquet, or XML files. Our AI engine clean, extract features, detect anomalies, and perform predictions.
                </p>
              </div>

              {/* Drag Drop Area */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
                style={{
                  border: `2px dashed ${dragOver ? theme.accent2 : 'rgba(124, 58, 237, 0.3)'}`,
                  borderRadius: 24, padding: isMobile ? '48px 24px' : '80px 40px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragOver ? 'rgba(124, 58, 237, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: dragOver ? `0 0 40px ${theme.accent}15, ${cardGlow}` : cardGlow,
                  marginBottom: 32,
                }}>
                <input id="fileInput" type="file" onChange={handleFileInput} style={{ display: 'none' }} />
                <div style={{ fontSize: 56, marginBottom: 20, filter: `drop-shadow(0 0 15px ${theme.accent}20)` }}>📂</div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                  {dragOver ? 'Drop to start analyzing!' : 'Drag & drop your files here'}
                </div>
                <div style={{ fontSize: 13, color: theme.textSecondary, marginBottom: 24 }}>or click to browse local storage</div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {['CSV', 'Excel', 'JSON', 'TSV', 'Parquet', 'XML'].map(f => (
                    <span key={f} style={{
                      fontSize: 10, padding: '5px 12px', borderRadius: 8,
                      background: 'rgba(124, 58, 237, 0.08)', border: `1px solid ${theme.border}`,
                      color: theme.accent2, fontFamily: 'monospace', fontWeight: 700
                    }}>{f}</span>
                  ))}
                </div>
              </div>

              {/* Demo Loader Container */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
                <button
                  onClick={loadSampleDataset}
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                    border: 'none', borderRadius: 16, color: '#fff',
                    padding: '16px 36px', fontSize: 14, fontWeight: 600,
                    cursor: 'pointer', boxShadow: accentGlow(theme.accent2),
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  ⚡ Explore with Demo Dataset
                </button>
              </div>

              {/* Features cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {[
                  { icon: '⚙️', title: 'Auto cleaning & ETL', desc: 'Auto-detect missing variables, deduplicate indices, format date fields, and add rolling averages.' },
                  { icon: '📊', title: 'Interactive Dashboard', desc: 'Select any metric to visualize monthly trends, aggregate sums, means, and categorical proportions.' },
                  { icon: '🔮', title: 'Predictive XGBoost', desc: 'Train forecasting algorithms on the fly to predict future timelines with confidence bands.' },
                  { icon: '🧩', title: 'K-Means Customer Segments', desc: 'Cluster clients based on multi-variate metrics. Profiles champions, at-risk, and lost audiences.' }
                ].map((f, i) => (
                  <GlassCard key={i} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 28, marginBottom: 4 }}>{f.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>{f.title}</div>
                    <div style={{ fontSize: 12, color: theme.textSecondary, lineHeight: 1.6 }}>{f.desc}</div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* PAGE: DASHBOARD */}
          {page === 'dashboard' && dashboardData && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              
              {/* Header metrics summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 30 }}>
                <KPICard label="Total Rows" value={dashboardData.rows?.toLocaleString()} color={theme.green} icon="📋" description="Parsed & cleaned entries" />
                <KPICard label="Total Columns" value={dashboardData.columns?.length} color={theme.blue} icon="📐" description="Detected variables" />
                <KPICard label="Numeric Fields" value={dashboardData.numeric_columns?.length} color={theme.cyan} icon="🔢" description="Aggregatable metrics" />
              </div>

              {/* Main Interactive Time Series Chart */}
              {dashboardData.monthly_trend?.data?.length > 0 ? (
                <GlassCard style={{ marginBottom: 30 }} title="Timeline Analysis" badge="DYNAMIC CHART">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
                    <div style={{ fontSize: 12, color: theme.textSecondary }}>Choose metric to plot:</div>
                    <select
                      value={dashMetric}
                      onChange={e => setDashMetric(e.target.value)}
                      style={{
                        background: theme.bg3, border: `1px solid ${theme.border}`,
                        color: theme.text, padding: '8px 16px', borderRadius: 10,
                        outline: 'none', cursor: 'pointer', fontSize: 13
                      }}
                    >
                      {dashboardData.numeric_columns.map(col => (
                        <option key={col} value={col}>{col.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                      <AreaChart data={dashboardData.monthly_trend.data}>
                        <defs>
                          <linearGradient id="dashboardAreaGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.accent} stopOpacity={0.4}/>
                            <stop offset="95%" stopColor={theme.accent} stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                        <XAxis dataKey="month" stroke={theme.textMuted} fontSize={11} tickLine={false} />
                        <YAxis stroke={theme.textMuted} fontSize={11} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                        <Tooltip contentStyle={{ background: theme.bg2, borderColor: theme.border, borderRadius: 12, color: theme.text }} />
                        <Area type="monotone" dataKey={dashMetric} stroke={theme.accent} strokeWidth={2.5} fillOpacity={1} fill="url(#dashboardAreaGlow)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </GlassCard>
              ) : (
                <GlassCard style={{ marginBottom: 30, textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📅</div>
                  <div style={{ fontSize: 14, color: theme.textSecondary }}>No datetime columns detected for timeline plotting.</div>
                </GlassCard>
              )}

              {/* Categorical Breakdown Section */}
              {Object.keys(dashboardData.categorical_breakdowns || {}).length > 0 && (
                <div style={{ marginBottom: 30 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, letterSpacing: '0.3px' }}>Categorical Distribution</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
                    {Object.entries(dashboardData.categorical_breakdowns).map(([colName, list]) => (
                      <GlassCard key={colName} title={`${colName.toUpperCase()} SHARE`}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: 16 }}>
                          <div style={{ width: 140, height: 140 }}>
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                              <PieChart>
                                <Pie
                                  data={list}
                                  cx="50%" cy="50%"
                                  innerRadius={40} outerRadius={60}
                                  paddingAngle={3}
                                  dataKey="value"
                                >
                                  {list.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: theme.bg3, border: `1px solid ${theme.border}`, color: '#fff', borderRadius: 8 }} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          
                          <div style={{ flex: 1, width: '100%' }}>
                            {list.slice(0, 4).map((entry, index) => {
                              const totalVal = list.reduce((a, b) => a + b.value, 0)
                              const pct = totalVal > 0 ? ((entry.value / totalVal) * 100).toFixed(1) : 0
                              return (
                                <div key={entry.name} style={{ marginBottom: 10 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
                                    <span style={{ color: theme.textSecondary, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS[index % COLORS.length] }} />
                                      {entry.name}
                                    </span>
                                    <span style={{ color: theme.text, fontFamily: 'monospace' }}>{pct}%</span>
                                  </div>
                                  <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: COLORS[index % COLORS.length], width: `${pct}%` }} />
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {/* Descriptive Stats Table */}
              <GlassCard title="Feature Statistics Matrix" badge="DESCRIPTIVE">
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: 11, fontFamily: 'monospace' }}>
                        <th style={{ padding: '12px 16px' }}>METRIC COLUMN</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>SUM TOTAL</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>MEAN AVG</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>MAX RECORD</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right' }}>MIN RECORD</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dashboardData.summary || {}).map(([col, stats]) => (
                        <tr key={col} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: 13 }} className="table-row-hover">
                          <td style={{ padding: '16px', fontWeight: 600, color: theme.accent2 }}>{col.toUpperCase()}</td>
                          <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: theme.green }}>{stats.total?.toLocaleString()}</td>
                          <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace' }}>{stats.mean?.toLocaleString()}</td>
                          <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: theme.amber }}>{stats.max?.toLocaleString()}</td>
                          <td style={{ padding: '16px', textAlign: 'right', fontFamily: 'monospace', color: theme.cyan }}>{stats.min?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {/* PAGE: AI INSIGHTS */}
          {page === 'insights' && insightsData && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Gemini AI Insights</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary }}>Automated diagnostic statements outlining core trends, opportunities, and anomalies inside dataset.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {insightsData.insights?.map((ins, i) => {
                  const typeColors = {
                    anomaly: theme.red,
                    opportunity: theme.green,
                    trend: theme.accent2
                  }
                  const color = typeColors[ins.type] || theme.accent
                  return (
                    <div key={i} style={{
                      background: theme.card,
                      border: `1px solid ${theme.border}`,
                      borderLeft: `4px solid ${color}`,
                      borderRadius: 16, padding: 24,
                      boxShadow: `${cardGlow}, -4px 0 20px ${color}10`,
                      animation: `fadeIn ${0.3 + i * 0.1}s ease`,
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 15, fontWeight: 700 }}>{ins.title}</span>
                          <span style={{
                            fontSize: 9, padding: '2px 8px', borderRadius: 6, fontWeight: 700, fontFamily: 'monospace',
                            background: `${color}15`, color, border: `1px solid ${color}30`
                          }}>{ins.type?.toUpperCase()}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: 10, color: theme.textSecondary, fontFamily: 'monospace' }}>Confidence: {ins.confidence}%</span>
                          <div style={{ width: 80, height: 4, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: color, width: `${ins.confidence}%` }} />
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 1.7 }}>{ins.body}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PAGE: ANOMALIES */}
          {page === 'anomalies' && anomalyData && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
                <KPICard label="Anomalies Found" value={anomalyData.anomalies_found} color={theme.red} icon="⚠️" description="Flagged outlier records" />
                <KPICard label="Total Rows Checked" value={anomalyData.total_rows_checked?.toLocaleString()} color={theme.amber} icon="🔍" description="Total rows input scan" />
              </div>

              {anomalyData.severity_counts && (
                <GlassCard title="Outlier Severity Profile" style={{ marginBottom: 30 }} badge="BREAKDOWN">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {['high', 'medium', 'low'].map(sev => {
                      const count = anomalyData.severity_counts[sev] || 0
                      const maxCount = anomalyData.anomalies_found || 1
                      const pct = ((count / maxCount) * 100).toFixed(1)
                      const color = sev === 'high' ? theme.red : sev === 'medium' ? theme.amber : theme.green
                      return (
                        <div key={sev}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                            <span style={{ fontWeight: 700, color: theme.text, fontFamily: 'monospace' }}>{sev.toUpperCase()} SEVERITY</span>
                            <span style={{ color: theme.textSecondary, fontFamily: 'monospace' }}>{count} ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, background: 'rgba(255, 255, 255, 0.05)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: color, width: `${pct}%`, boxShadow: `0 0 10px ${color}50` }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </GlassCard>
              )}

              {/* Anomaly list with Search / Filter */}
              <GlassCard title="Flagged Data Records" badge="ISOLATION FOREST">
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexDirection: isMobile ? 'column' : 'row' }}>
                  <input
                    value={anomalySearch}
                    onChange={e => setAnomalySearch(e.target.value)}
                    placeholder="Search flagged items..."
                    style={{
                      flex: 1, background: theme.bg3, border: `1px solid ${theme.border}`,
                      borderRadius: 12, padding: '10px 16px', color: '#fff', outline: 'none',
                      fontSize: 13
                    }}
                  />
                  <select
                    value={anomalySevFilter}
                    onChange={e => setAnomalySevFilter(e.target.value)}
                    style={{
                      background: theme.bg3, border: `1px solid ${theme.border}`,
                      color: '#fff', padding: '10px 16px', borderRadius: 12,
                      outline: 'none', cursor: 'pointer', fontSize: 13, minWidth: 140
                    }}
                  >
                    <option value="all">ALL SEVERITY</option>
                    <option value="high">HIGH ONLY</option>
                    <option value="medium">MEDIUM ONLY</option>
                    <option value="low">LOW ONLY</option>
                  </select>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: 600 }}>
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border}`, color: theme.textSecondary, fontSize: 11, fontFamily: 'monospace' }}>
                        <th style={{ padding: '12px 16px' }}>SEVERITY</th>
                        <th style={{ padding: '12px 16px' }}>SCORE</th>
                        <th style={{ padding: '12px 16px' }}>ANOMALY DETAILS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(anomalyData.anomaly_records || [])
                        .filter(r => anomalySevFilter === 'all' ? true : r._severity === anomalySevFilter)
                        .filter(r => {
                          if (!anomalySearch) return true
                          return Object.values(r).some(v => String(v).toLowerCase().includes(anomalySearch.toLowerCase()))
                        })
                        .map((row, idx) => {
                          const col = row._severity === 'high' ? theme.red : row._severity === 'medium' ? theme.amber : theme.green
                          // Create copy and delete system flags for printable key list
                          const printRow = { ...row }
                          delete printRow._severity
                          delete printRow._anomaly_score
                          delete printRow._is_anomaly

                          return (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: 12 }}>
                              <td style={{ padding: '14px 16px' }}>
                                <span style={{
                                  fontSize: 9, padding: '3px 8px', borderRadius: 6, fontWeight: 700, fontFamily: 'monospace',
                                  background: col + '15', color: col, border: `1px solid ${col}30`
                                }}>{row._severity?.toUpperCase()}</span>
                              </td>
                              <td style={{ padding: '14px 16px', fontFamily: 'monospace' }}>
                                {row._anomaly_score?.toFixed(4)}
                              </td>
                              <td style={{ padding: '14px 16px', color: theme.textSecondary, fontFamily: 'monospace', fontSize: 11 }}>
                                {Object.entries(printRow).map(([k, v]) => `${k}:${v}`).join(' | ')}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </GlassCard>
            </div>
          )}

          {/* PAGE: FORECASTING */}
          {page === 'forecast' && dashboardData && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>XGBoost Time-Series Forecasting</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary }}>Train lag-based regression algorithms on historical dates to predict future numeric milestones.</p>
              </div>

              {/* Controls config */}
              <GlassCard style={{ marginBottom: 30 }} title="Model Hyperparameters">
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <label style={{ display: 'block', fontSize: 11, color: theme.textSecondary, marginBottom: 8 }}>Target Forecast Variable:</label>
                    <select
                      value={foreCol}
                      onChange={e => setForeCol(e.target.value)}
                      style={{
                        width: '100%', background: theme.bg3, border: `1px solid ${theme.border}`,
                        color: theme.text, padding: '10px 16px', borderRadius: 12, outline: 'none', fontSize: 13
                      }}
                    >
                      {dashboardData.numeric_columns.map(col => (
                        <option key={col} value={col}>{col.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ width: 140 }}>
                    <label style={{ display: 'block', fontSize: 11, color: theme.textSecondary, marginBottom: 8 }}>Forecast Horizon (Periods):</label>
                    <select
                      value={forePeriods}
                      onChange={e => setForePeriods(e.target.value)}
                      style={{
                        width: '100%', background: theme.bg3, border: `1px solid ${theme.border}`,
                        color: theme.text, padding: '10px 16px', borderRadius: 12, outline: 'none', fontSize: 13
                      }}
                    >
                      {[3, 6, 12, 18].map(p => (
                        <option key={p} value={p}>{p} Months</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => runForecast(foreCol, forePeriods)}
                    disabled={foreLoading}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                      border: 'none', borderRadius: 12, color: '#fff',
                      padding: '10px 24px', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', boxShadow: accentGlow(theme.accent2),
                      minWidth: 150, height: 42,
                    }}
                  >
                    {foreLoading ? 'TRAINING...' : 'TRAIN XGBOOST'}
                  </button>
                </div>
              </GlassCard>

              {/* Chart results */}
              {forecastData && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
                    <KPICard label="Algorithm Type" value="XGBRegressor" color={theme.accent2} icon="🤖" description="Gradient Boosting Decision Trees" />
                    <KPICard label="Estimated MAPE" value={`${forecastData.mape_estimate}%`} color={theme.green} icon="🎯" description="Mean absolute percentage error" />
                  </div>

                  <GlassCard title="Actual vs Forecast Projection" badge="MODEL OUTPUT">
                    <div style={{ width: '100%', height: 350 }}>
                      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <LineChart data={forecastChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                          <XAxis dataKey="name" stroke={theme.textMuted} fontSize={11} tickLine={false} />
                          <YAxis stroke={theme.textMuted} fontSize={11} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                          <Tooltip contentStyle={{ background: theme.bg2, borderColor: theme.border, borderRadius: 12, color: theme.text }} />
                          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                          <Line type="monotone" dataKey="actual" stroke={theme.cyan} strokeWidth={2.5} name="Historical Actuals" dot={{ r: 3 }} />
                          <Line type="monotone" dataKey="prediction" stroke={theme.accent2} strokeWidth={2.5} strokeDasharray="5 5" name="XGB Forecast" dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          )}

          {/* PAGE: CUSTOMER SEGMENTS */}
          {page === 'segmentation' && dashboardData && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>K-Means Customer Segmentation</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary }}>Identify customer classes and profile key client groups dynamically using normalized cluster scoring.</p>
              </div>

              {/* Configurations panel */}
              <GlassCard title="Cluster Matrix Configurations" style={{ marginBottom: 30 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: theme.textSecondary, marginBottom: 10 }}>Select features to use for clustering:</label>
                    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                      {dashboardData.numeric_columns.map(col => {
                        const checked = segFeatures.includes(col)
                        return (
                          <label key={col} style={{
                            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12,
                            background: checked ? 'rgba(124, 58, 237, 0.1)' : 'rgba(255,255,255,0.01)',
                            border: `1px solid ${checked ? theme.accent : theme.border}`,
                            padding: '6px 14px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s'
                          }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSegFeatures(prev => [...prev, col])
                                } else {
                                  setSegFeatures(prev => prev.filter(c => c !== col))
                                }
                              }}
                              style={{ display: 'none' }}
                            />
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: checked ? theme.accent2 : 'transparent', border: `1px solid ${theme.textMuted}` }} />
                            {col.toUpperCase()}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ width: 140 }}>
                      <label style={{ display: 'block', fontSize: 11, color: theme.textSecondary, marginBottom: 8 }}>Cluster Size (k):</label>
                      <select
                        value={segK}
                        onChange={e => setSegK(e.target.value)}
                        style={{
                          width: '100%', background: theme.bg3, border: `1px solid ${theme.border}`,
                          color: theme.text, padding: '10px 16px', borderRadius: 12, outline: 'none', fontSize: 13
                        }}
                      >
                        {[3, 4, 5, 6].map(k => (
                          <option key={k} value={k}>{k} Segments</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => runSegmentation(segFeatures, segK)}
                      disabled={segLoading || segFeatures.length === 0}
                      style={{
                        background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                        border: 'none', borderRadius: 12, color: '#fff',
                        padding: '10px 24px', fontSize: 13, fontWeight: 600,
                        cursor: 'pointer', boxShadow: accentGlow(theme.accent2),
                        minWidth: 150, height: 42,
                      }}
                    >
                      {segLoading ? 'CLUSTERING...' : 'RUN K-MEANS'}
                    </button>
                  </div>
                </div>
              </GlassCard>

              {segmentationData && (
                <div style={{ animation: 'fadeIn 0.4s ease' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
                    <KPICard label="K-Means Clusters" value={segmentationData.k} color={theme.accent} icon="🧩" description="Segments formed" />
                    <KPICard label="Silhouette Score" value={segmentationData.silhouette_score} color={theme.green} icon="🎯" description="Cluster cohesion quality metric" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 30 }}>
                    {/* Size distribution */}
                    <GlassCard title="Segment Proportions" badge="PIE SHARE">
                      <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                          <PieChart>
                            <Pie
                              data={Object.entries(segmentationData.cluster_sizes).map(([name, size]) => ({ name, value: size }))}
                              cx="50%" cy="50%"
                              innerRadius={60} outerRadius={85}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {Object.keys(segmentationData.cluster_sizes).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{ background: theme.bg3, borderColor: theme.border, borderRadius: 8, color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </GlassCard>

                    {/* Cluster profiling metrics */}
                    <GlassCard title="Cohort Averages Profile" badge="SUMMARY">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {segmentationData.profiles?.map((prof, index) => (
                          <div key={prof.segment} style={{ background: 'rgba(255, 255, 255, 0.01)', border: `1px solid ${theme.border}`, padding: 14, borderRadius: 12 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                              <span style={{ fontSize: 13, fontWeight: 700, color: COLORS[index % COLORS.length] }}>{prof.segment}</span>
                              <span style={{ fontSize: 10, color: theme.textSecondary, fontFamily: 'monospace' }}>size: {prof.size} rows</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: 10 }}>
                              {Object.entries(prof.averages).map(([feat, avg]) => (
                                <div key={feat} style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 8px', borderRadius: 6 }}>
                                  <div style={{ fontSize: 9, color: theme.textMuted, fontFamily: 'monospace' }}>{feat.toUpperCase()}</div>
                                  <div style={{ fontSize: 11, fontWeight: 600, color: '#fff' }}>{avg?.toLocaleString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PAGE: ASK DATA (CHAT) */}
          {page === 'chat' && (
            <div style={{ animation: 'fadeIn 0.4s ease' }}>
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>Ask Your Data</h3>
                <p style={{ fontSize: 13, color: theme.textSecondary }}>Ask any business-specific queries, and Gemini will aggregate metrics and answer using tabular data summaries.</p>
              </div>

              <GlassCard style={{ minHeight: 480, display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Message logs */}
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 320, paddingRight: 8 }}>
                  {chatHistory.map((ch, idx) => (
                    <ChatMessage key={idx} text={ch.text} sender={ch.sender} isMobile={isMobile} />
                  ))}
                </div>

                {/* Preset suggestions */}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[
                    'Generate invoice for order 1001',
                    'Create bill for customer C002',
                    'Generate financial report',
                    'What is the total revenue?'
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => askChat(q)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.02)', border: `1px solid ${theme.border}`,
                        color: theme.textSecondary, borderRadius: 10, padding: '8px 14px',
                        cursor: 'pointer', fontSize: 11, transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = theme.accent2
                        e.currentTarget.style.color = '#fff'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = theme.border
                        e.currentTarget.style.color = theme.textSecondary
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input query field */}
                <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${theme.border}`, paddingTop: 16 }}>
                  <input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && askChat()}
                    placeholder="Ask a question about the metrics (e.g. Total counts, outliers, forecasts)..."
                    style={{
                      flex: 1, background: theme.bg3, border: `1px solid ${theme.border}`,
                      borderRadius: 12, padding: '14px 20px', color: '#fff',
                      fontSize: 13, outline: 'none'
                    }}
                  />
                  <button
                    onClick={() => askChat()}
                    style={{
                      background: 'linear-gradient(135deg, #7c3aed, #d946ef)',
                      border: 'none', borderRadius: 12, color: '#fff',
                      padding: '0 28px', fontSize: 13, fontWeight: 600,
                      cursor: 'pointer', boxShadow: accentGlow(theme.accent2),
                    }}
                  >
                    SEND
                  </button>
                </div>
              </GlassCard>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}