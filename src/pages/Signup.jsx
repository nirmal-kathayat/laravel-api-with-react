import { useState } from 'react'
import { Link } from 'react-router-dom'
import { colors, fonts } from '../theme'
import Logo from '../components/common/Logo'

const Eye = ({ open }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.faint}
    strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    )}
  </svg>
)

const Check = ({ checked }) => (
  <div style={{
    width: 18, height: 18, borderRadius: 5,
    border: `2px solid ${checked ? colors.brand : colors.line}`,
    background: checked ? colors.brand : 'transparent',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, transition: 'all .15s',
  }}>
    {checked && (
      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}
        strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    )}
  </div>
)

export default function Signup() {
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [notice, setNotice] = useState(false)

  const field = (key) => ({
    value: form[key],
    onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }

    // There's no /api/register endpoint yet — this is the backend module
    // that still needs to be built, so be upfront about it instead of
    // faking a successful account creation.
    setNotice(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: fonts.body,
    }}>
      <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
        <Logo />
      </Link>

      <div style={{
        width: '100%',
        maxWidth: 440,
        background: colors.white,
        borderRadius: 20,
        border: `1px solid ${colors.line}`,
        boxShadow: '0 4px 24px rgba(16,24,40,.06)',
        padding: '40px 40px 36px',
      }}>
        <h1 style={{
          fontFamily: fonts.display,
          fontSize: 26,
          fontWeight: 700,
          color: colors.ink,
          margin: '0 0 6px',
        }}>Create account</h1>
        <p style={{ fontSize: 14, color: colors.muted, margin: '0 0 28px' }}>
          Join Lumora and start shopping today
        </p>

        {error && (
          <div style={{
            background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10,
            padding: '10px 14px', fontSize: 13, color: '#DC2626', marginBottom: 16,
          }}>
            {error}
          </div>
        )}

        {notice && (
          <div style={{
            background: colors.brandSoft, border: `1px solid ${colors.brand}`, borderRadius: 10,
            padding: '12px 14px', fontSize: 13, color: colors.ink, marginBottom: 16, lineHeight: 1.5,
          }}>
            Account creation isn't live yet — we're still wiring up the signup API.{' '}
            Already have an account?{' '}
            <Link to="/login" style={{ color: colors.brand, fontWeight: 700, textDecoration: 'none' }}>Sign in</Link>.
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>Full name</span>
            <input
              type="text"
              placeholder="John Doe"
              required
              {...field('name')}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              required
              {...field('email')}
              style={inputStyle}
            />
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>Password</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                {...field('password')}
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex',
                }}
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                <Eye open={showPass} />
              </button>
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: colors.inkSoft }}>Confirm password</span>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Repeat your password"
                required
                {...field('confirm')}
                style={{ ...inputStyle, paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                style={{
                  position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex',
                }}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                <Eye open={showConfirm} />
              </button>
            </div>
          </label>

          <button
            type="button"
            onClick={() => setAgreed((v) => !v)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              textAlign: 'left',
            }}
          >
            <Check checked={agreed} />
            <span style={{ fontSize: 13, color: colors.slate, lineHeight: 1.5 }}>
              I agree to the{' '}
              <a href="#" onClick={(e) => e.stopPropagation()}
                style={{ color: colors.brand, fontWeight: 600, textDecoration: 'none' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" onClick={(e) => e.stopPropagation()}
                style={{ color: colors.brand, fontWeight: 600, textDecoration: 'none' }}>
                Privacy Policy
              </a>
            </span>
          </button>

          <button
            type="submit"
            disabled={!agreed}
            style={{ ...primaryBtn, opacity: agreed ? 1 : 0.5, cursor: agreed ? 'pointer' : 'not-allowed' }}
          >
            Create account
          </button>
        </form>

        <div style={dividerStyle}>
          <span style={dividerLine} />
          <span style={{ fontSize: 12, color: colors.faint, padding: '0 12px', whiteSpace: 'nowrap' }}>or continue with</span>
          <span style={dividerLine} />
        </div>

        <button style={googleBtn}>
          <GoogleIcon />
          Sign up with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, color: colors.muted, margin: '24px 0 0' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: colors.brand, fontWeight: 700, textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  height: 44,
  border: `1px solid ${colors.line}`,
  borderRadius: 12,
  padding: '0 14px',
  fontFamily: fonts.body,
  fontSize: 14,
  color: colors.ink,
  background: colors.white,
  outline: 'none',
  boxSizing: 'border-box',
}

const primaryBtn = {
  width: '100%',
  height: 46,
  background: colors.brand,
  color: '#fff',
  border: 'none',
  borderRadius: 12,
  fontSize: 15,
  fontWeight: 700,
  fontFamily: fonts.body,
  cursor: 'pointer',
  marginTop: 4,
}

const dividerStyle = {
  display: 'flex',
  alignItems: 'center',
  margin: '24px 0',
}

const dividerLine = {
  flex: 1,
  height: 1,
  background: colors.line,
  display: 'block',
}

const googleBtn = {
  width: '100%',
  height: 44,
  background: colors.white,
  border: `1px solid ${colors.line}`,
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  fontSize: 14,
  fontWeight: 600,
  fontFamily: fonts.body,
  color: colors.ink,
  cursor: 'pointer',
}

const GoogleIcon = () => (
  <svg width={18} height={18} viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.25 0 5.82 1.12 7.73 2.91l5.74-5.74C33.79 3.49 29.26 1.5 24 1.5 14.97 1.5 7.3 7.08 4.03 15.02l6.69 5.19C12.33 13.97 17.67 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24c0-1.64-.15-3.22-.42-4.74H24v9.01h12.67c-.55 2.93-2.21 5.42-4.71 7.09l7.34 5.7C43.53 37.05 46.5 30.96 46.5 24z"/>
    <path fill="#FBBC05" d="M10.72 28.21A14.45 14.45 0 0 1 9.5 24c0-1.47.25-2.9.72-4.21L3.53 14.6A22.41 22.41 0 0 0 1.5 24c0 3.63.87 7.06 2.53 10.03l6.69-5.82z"/>
    <path fill="#34A853" d="M24 46.5c5.26 0 9.68-1.73 12.9-4.71l-7.34-5.7c-1.8 1.2-4.1 1.91-5.56 1.91-6.33 0-11.67-4.47-13.28-10.5l-6.69 5.82C7.3 40.92 14.97 46.5 24 46.5z"/>
  </svg>
)
