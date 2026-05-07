import { useState } from 'react'

const statusMap = {
  pending:  { label: 'En attente',    bg: '#fef3c7', color: '#92400e' },
  printing: { label: 'En impression', bg: '#dbeafe', color: '#1e40af' },
  done:     { label: 'Terminé',       bg: '#d1fae5', color: '#065f46' },
  shipped:  { label: 'Expédié',       bg: '#ede9fe', color: '#4c1d95' },
  cancelled:{ label: 'Annulé',        bg: '#fee2e2', color: '#991b1b' },
}

function Dashboard({ user, orders, onLogout, onNavigate, onRecharger }) {
  const [montant, setMontant] = useState(100)
  const [recharging, setRecharging] = useState(false)
  const [message, setMessage] = useState('')
  const [search, setSearch] = useState('')

  // async/await pour recharger le solde
  const handleRecharger = async () => {
    setRecharging(true)
    setMessage('')
    try {
      await onRecharger(montant)
      setMessage(`${montant} MAD ajoutés à votre solde !`)
    } catch (err) {
      setMessage('Erreur lors du rechargement')
    } finally {
      setRecharging(false)
      // callback après 3 secondes
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const filteredOrders = (orders || []).filter(o => {
    const fileName = String(o?.fileName || '').toLowerCase()
    const id = String(o?.id || '').toLowerCase()
    const term = String(search || '').toLowerCase()
    return fileName.includes(term) || id.includes(term)
  })

  // Utilisation de Promises et Async/Await pour la navigation
  const handleToggleView = async () => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        await onNavigate('admin')
        resolve()
      }, 100)
    })
  }

  const stats = [
    { label: 'Commandes totales', value: orders.length },
    { label: 'En cours', value: orders.filter(o => o.status === 'printing').length },
    { label: 'Terminées', value: orders.filter(o => o.status === 'done' || o.status === 'shipped').length },
    { label: 'Mon solde', value: `${user?.solde} MAD`, green: true },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{
        background: 'white', borderBottom: '1px solid #f3f4f6',
        padding: '14px 24px', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: '#10b981',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 700
          }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Click2Print</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {(user?.role === 'admin' || user?.role === 'operator') && (
            <button 
              onClick={handleToggleView} 
              style={{ 
                background: '#8b5cf6', color: 'white', border: 'none', 
                borderRadius: 8, padding: '8px 16px', fontSize: 13, 
                fontWeight: 500, cursor: 'pointer', display: 'flex', 
                alignItems: 'center', gap: 6 
              }}
            >
              <span>⚙️</span> Vue Admin
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une commande..."
              style={{ 
                border: '1px solid #e5e7eb', borderRadius: 10, 
                padding: '7px 12px', fontSize: 13, outline: 'none', 
                width: 220, background: '#f9fafb' 
              }}
            />
          </div>

          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#d1fae5', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#059669'
          }}>
            {user?.avatar}
          </div>
          <span style={{ fontSize: 14, color: '#6b7280' }}>{user?.name}</span>
          <span style={{
            fontSize: 13, fontWeight: 600, color: '#10b981',
            background: '#d1fae5', padding: '4px 12px', borderRadius: 20
          }}>
            {user?.solde} MAD
          </span>
          <button
            onClick={onLogout}
            style={{
              fontSize: 13, color: '#9ca3af', background: 'none',
              border: '1px solid #e5e7eb', borderRadius: 8,
              padding: '6px 12px', cursor: 'pointer'
            }}
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Bienvenue */}
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
          Bonjour, {user?.name}
        </h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 24 }}>
          Gérez vos commandes d'impression 3D
        </p>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: 'white', borderRadius: 14,
              border: '1px solid #f3f4f6', padding: '16px 18px'
            }}>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{s.label}</p>
              <p style={{ fontSize: 24, fontWeight: 600, color: s.green ? '#10b981' : '#111827' }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recharger solde */}
        <div style={{
          background: 'white', borderRadius: 14,
          border: '1px solid #f3f4f6', padding: '20px 24px',
          marginBottom: 24
        }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>
            Recharger mon solde
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {[50, 100, 200, 500].map(m => (
              <button
                key={m}
                onClick={() => setMontant(m)}
                style={{
                  padding: '8px 18px', borderRadius: 10, fontSize: 14,
                  border: montant === m ? '2px solid #10b981' : '1px solid #e5e7eb',
                  background: montant === m ? '#d1fae5' : 'white',
                  color: montant === m ? '#059669' : '#374151',
                  cursor: 'pointer', fontWeight: montant === m ? 600 : 400
                }}
              >
                {m} MAD
              </button>
            ))}
            <button
              onClick={handleRecharger}
              disabled={recharging}
              style={{
                padding: '8px 20px', borderRadius: 10, fontSize: 14,
                background: recharging ? '#9ca3af' : '#10b981',
                color: 'white', border: 'none',
                cursor: recharging ? 'not-allowed' : 'pointer', fontWeight: 500
              }}
            >
              {recharging ? 'Rechargement...' : 'Recharger →'}
            </button>
          </div>
          {message && (
            <p style={{ fontSize: 13, marginTop: 10, color: '#059669' }}>{message}</p>
          )}
        </div>

        {/* CTA Nouvelle commande */}
        <div style={{
          background: '#10b981', borderRadius: 14,
          padding: '20px 24px', marginBottom: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: 'white', margin: '0 0 4px' }}>
              Nouvelle commande
            </h2>
            <p style={{ fontSize: 13, color: '#d1fae5', margin: 0 }}>
              Uploadez votre fichier STL et obtenez un devis instantané
            </p>
          </div>
          <button
            onClick={() => onNavigate('order')}
            style={{
              background: 'white', color: '#059669',
              border: 'none', borderRadius: 10,
              padding: '10px 20px', fontSize: 14,
              fontWeight: 600, cursor: 'pointer'
            }}
          >
            Commander →
          </button>
        </div>

        {/* Tableau commandes */}
        <div style={{
          background: 'white', borderRadius: 14,
          border: '1px solid #f3f4f6', overflow: 'hidden'
        }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #f9fafb',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#111827' }}>
              Mes commandes
            </span>
            <span style={{ fontSize: 12, color: '#9ca3af' }}>
              {filteredOrders.length} commandes
            </span>
          </div>

          {filteredOrders.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📦</div>
              <p style={{ color: '#9ca3af', fontSize: 14 }}>Aucune commande pour l'instant</p>
              <button
                onClick={() => onNavigate('order')}
                style={{
                  marginTop: 12, background: '#10b981', color: 'white',
                  border: 'none', borderRadius: 10, padding: '10px 20px',
                  fontSize: 14, cursor: 'pointer'
                }}
              >
                Passer ma première commande →
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  {['ID', 'Fichier', 'Matériau', 'Couleur', 'Qté', 'Prix', 'Statut', 'Date'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 16px',
                      fontSize: 11, fontWeight: 500,
                      color: '#9ca3af', textTransform: 'uppercase'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(o => (
                  <tr key={o.id} style={{ borderTop: '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 500 }}>
                      #{o.id}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>{o.fileName}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{o.material}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{o.color}</td>
                    <td style={{ padding: '12px 16px', color: '#374151' }}>{o.quantity}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#374151' }}>
                      {o.price} MAD
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: 11, fontWeight: 500,
                        padding: '3px 10px', borderRadius: 20,
                        background: statusMap[o.status]?.bg,
                        color: statusMap[o.status]?.color
                      }}>
                        {statusMap[o.status]?.label}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{o.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard