import { useState } from 'react'

function Register({ onRegister, onNavigate }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validation
    if (!form.name.trim()) {
      setError('Le nom est requis')
      return
    }
    if (!form.email.trim()) {
      setError('L\'email est requis')
      return
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }

    setLoading(true)
    try {
      await onRegister(form.name, form.email, form.password)
      // Redirection après inscription réussie
      setTimeout(() => onNavigate('login'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: 16,
        border: '1px solid #f3f4f6',
        padding: '32px',
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36,
            background: '#10b981',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: 16
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#111827' }}>Click2Print</span>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
          Inscription
        </h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24 }}>
          Créez votre compte pour commander
        </p>

        {/* Erreur */}
        {error && (
          <div style={{
            background: '#fee2e2', color: '#991b1b',
            borderRadius: 10, padding: '10px 14px',
            fontSize: 13, marginBottom: 16,
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Nom complet
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jean Dupont"
              required
              style={{
                width: '100%', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="vous@example.com"
              required
              style={{
                width: '100%', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="•••••••• (min. 6 caractères)"
              required
              style={{
                width: '100%', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%', border: '1px solid #e5e7eb',
                borderRadius: 10, padding: '10px 14px',
                fontSize: 14, outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', background: loading ? '#9ca3af' : '#10b981',
              color: 'white', border: 'none', borderRadius: 10,
              padding: '12px 0', fontSize: 15, fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#6b7280' }}>
          Déjà un compte ?{' '}
          <button
            onClick={() => onNavigate('login')}
            style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}
          >
            Se connecter
          </button>
        </p>

        {/* Comptes de test (gardés) */}
        <div style={{
          marginTop: 24, background: '#f9fafb',
          borderRadius: 10, padding: '12px 14px',
          border: '1px solid #f3f4f6'
        }}>
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, fontWeight: 500 }}>
             Comptes de test :
          </p>
          {[
            { role: 'Admin', email: 'youssef@click2print.ma' },
            { role: 'Client', email: 'sara@click2print.ma' },
            { role: 'Opérateur', email: 'karim@click2print.ma' },
          ].map(c => (
            <div
              key={c.role}
              onClick={() => onNavigate('login')}
              style={{
                fontSize: 12, color: '#10b981',
                cursor: 'pointer', marginBottom: 4,
                display: 'flex', justifyContent: 'space-between'
              }}
            >
              <span>{c.role}</span>
              <span style={{ color: '#6b7280' }}>{c.email}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>
            Mot de passe : 123456
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register