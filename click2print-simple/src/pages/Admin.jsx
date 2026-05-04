import { useState } from 'react'

const statusMap = {
  pending:  { label: 'En attente',    bg: '#fef3c7', color: '#92400e' },
  printing: { label: 'En impression', bg: '#dbeafe', color: '#1e40af' },
  done:     { label: 'Terminé',       bg: '#d1fae5', color: '#065f46' },
  shipped:  { label: 'Expédié',       bg: '#ede9fe', color: '#4c1d95' },
  cancelled:{ label: 'Annulé',        bg: '#fee2e2', color: '#991b1b' },
}

const statusOptions = ['pending', 'printing', 'done', 'shipped', 'cancelled']

function Admin({ user, orders, users, machines, onLogout, onUpdateStatus, onAssignMachine, onUpdateRole, onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [message, setMessage] = useState('')

  const navItems = [
    { id: 'dashboard',  label: 'Dashboard'    },
    { id: 'orders',     label: 'Commandes'    },
    { id: 'users',      label: 'Utilisateurs' },
    { id: 'machines',   label: 'Machines'     },
    { id: 'assign',     label: 'Assignation'  },
  ]

  const filteredOrders = orders.filter(o =>
    o.fileName?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.id).includes(search)
  )

  const stats = [
    { label: 'Total commandes', value: orders.length,                                              color: '#10b981' },
    { label: 'En attente',      value: orders.filter(o => o.status === 'pending').length,          color: '#f59e0b' },
    { label: 'En impression',   value: orders.filter(o => o.status === 'printing').length,         color: '#3b82f6' },
    { label: 'Terminées',       value: orders.filter(o => ['done','shipped'].includes(o.status)).length, color: '#8b5cf6' },
  ]

  // async/await pour changer le statut
  const handleStatusChange = async (orderId, status) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    onUpdateStatus(orderId, status)
    setMessage(`✅ Statut mis à jour`)
    setTimeout(() => setMessage(''), 2000)
  }

  // async/await pour assigner machine
  const handleAssign = async (orderId, machineId) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    onAssignMachine(orderId, parseInt(machineId))
    setMessage(`✅ Machine assignée`)
    setTimeout(() => setMessage(''), 2000)
  }

  // async/await pour changer rôle
  const handleRoleChange = async (userId, role) => {
    await new Promise(resolve => setTimeout(resolve, 300))
    onUpdateRole(userId, role)
    setMessage(`✅ Rôle mis à jour`)
    setTimeout(() => setMessage(''), 2000)
  }

  const getUserName = (userId) => {
    const u = users.find(u => u.id === userId)
    return u ? u.name : 'Inconnu'
  }

  const S = {
    page:    { display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' },
    sidebar: { width: 210, background: 'white', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    main:    { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topbar:  { background: 'white', borderBottom: '1px solid #f3f4f6', padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    content: { flex: 1, overflowY: 'auto', padding: 24 },
    card:    { background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', overflow: 'hidden', marginBottom: 20 },
    th:      { textAlign: 'left', padding: '10px 16px', fontSize: 11, fontWeight: 500, color: '#9ca3af', textTransform: 'uppercase', background: '#f9fafb' },
    td:      { padding: '11px 16px', fontSize: 13, borderTop: '1px solid #f9fafb' },
    btn:     { background: '#10b981', color: 'white', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 13, fontWeight: 500, cursor: 'pointer' },
    btnSm:   { background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: 8, padding: '5px 12px', fontSize: 12, cursor: 'pointer' },
  }

  return (
    <div style={S.page}>

      {/* Sidebar */}
      <div style={S.sidebar}>
        <div style={{ padding: '20px 16px 14px', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#10b981', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>C</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Click2Print</span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>Panel Admin</div>
        </div>

        <nav style={{ padding: '10px 8px', flex: 1 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%', textAlign: 'left', padding: '9px 12px',
                borderRadius: 10, fontSize: 13, marginBottom: 2,
                border: 'none', cursor: 'pointer',
                background: activeTab === item.id ? '#f0fdf4' : 'transparent',
                color: activeTab === item.id ? '#059669' : '#6b7280',
                fontWeight: activeTab === item.id ? 600 : 400,
              }}
            >
              {item.label}
              {item.id === 'orders' && orders.filter(o => o.status === 'pending').length > 0 && (
                <span style={{
                  marginLeft: 6, background: '#10b981', color: 'white',
                  fontSize: 10, padding: '1px 6px', borderRadius: 10
                }}>
                  {orders.filter(o => o.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%', background: '#d1fae5',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 700, color: '#059669'
            }}>
              {user?.avatar}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>Admin</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ fontSize: 12, color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={S.main}>
        <div style={S.topbar}>
          <h1 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>
            {navItems.find(n => n.id === activeTab)?.label}
          </h1>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {message && <span style={{ fontSize: 13, color: '#059669' }}>{message}</span>}
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: '7px 12px', fontSize: 13, outline: 'none', width: 200 }}
            />
            <button onClick={() => onNavigate('order')} style={S.btn}>+ Nouvelle commande</button>
          </div>
        </div>

        <div style={S.content}>

          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
                {stats.map(s => (
                  <div key={s.label} style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '16px 18px' }}>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                <div style={S.card}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', fontWeight: 600, fontSize: 14, color: '#111827' }}>
                    Commandes récentes
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>{['ID', 'Client', 'Fichier', 'Prix', 'Statut', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 6).map(o => (
                        <tr key={o.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedOrder(o)}>
                          <td style={{ ...S.td, color: '#10b981', fontWeight: 600 }}>#{o.id}</td>
                          <td style={S.td}>{getUserName(o.userId)}</td>
                          <td style={{ ...S.td, color: '#6b7280' }}>{o.fileName}</td>
                          <td style={{ ...S.td, fontWeight: 500 }}>{o.price} MAD</td>
                          <td style={S.td}>
                            <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: statusMap[o.status]?.bg, color: statusMap[o.status]?.color }}>
                              {statusMap[o.status]?.label}
                            </span>
                          </td>
                          <td style={S.td} onClick={e => e.stopPropagation()}>
                            <select
                              value={o.status}
                              onChange={e => handleStatusChange(o.id, e.target.value)}
                              style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 8px', fontSize: 12, background: 'white', cursor: 'pointer', outline: 'none' }}
                            >
                              {statusOptions.map(s => <option key={s} value={s}>{statusMap[s]?.label}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={S.card}>
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', fontWeight: 600, fontSize: 14, color: '#111827' }}>
                    Machines
                  </div>
                  <div style={{ padding: 16 }}>
                    {machines.map(m => (
                      <div key={m.id} style={{ marginBottom: 14 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'printing' ? '#10b981' : m.status === 'error' ? '#ef4444' : '#d1d5db' }} />
                            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{m.name}</span>
                          </div>
                          <span style={{ fontSize: 12, color: '#9ca3af' }}>{m.status === 'printing' ? `${m.progress}%` : m.status}</span>
                        </div>
                        <div style={{ background: '#f3f4f6', borderRadius: 4, height: 4 }}>
                          <div style={{ height: '100%', borderRadius: 4, width: `${m.progress}%`, background: m.status === 'error' ? '#ef4444' : '#10b981' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* COMMANDES */}
          {activeTab === 'orders' && (
            <div style={S.card}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', fontWeight: 600, fontSize: 14, color: '#111827' }}>
                Toutes les commandes ({filteredOrders.length})
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['ID', 'Client', 'Fichier', 'Matériau', 'Qté', 'Prix', 'Statut', 'Date', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id}>
                      <td style={{ ...S.td, color: '#10b981', fontWeight: 600 }}>#{o.id}</td>
                      <td style={S.td}>{getUserName(o.userId)}</td>
                      <td style={{ ...S.td, color: '#6b7280' }}>{o.fileName}</td>
                      <td style={S.td}>{o.material}</td>
                      <td style={S.td}>{o.quantity}</td>
                      <td style={{ ...S.td, fontWeight: 500 }}>{o.price} MAD</td>
                      <td style={S.td}>
                        <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: statusMap[o.status]?.bg, color: statusMap[o.status]?.color }}>
                          {statusMap[o.status]?.label}
                        </span>
                      </td>
                      <td style={{ ...S.td, color: '#9ca3af' }}>{o.date}</td>
                      <td style={S.td}>
                        <select
                          value={o.status}
                          onChange={e => handleStatusChange(o.id, e.target.value)}
                          style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '4px 8px', fontSize: 12, background: 'white', cursor: 'pointer', outline: 'none' }}
                        >
                          {statusOptions.map(s => <option key={s} value={s}>{statusMap[s]?.label}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* UTILISATEURS */}
          {activeTab === 'users' && (
            <div style={S.card}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', fontWeight: 600, fontSize: 14, color: '#111827' }}>
                Utilisateurs ({users.length})
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['Avatar', 'Nom', 'Email', 'Rôle', 'Solde', 'Commandes', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={S.td}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#059669' }}>
                          {u.avatar}
                        </div>
                      </td>
                      <td style={{ ...S.td, fontWeight: 500 }}>{u.name}</td>
                      <td style={{ ...S.td, color: '#6b7280' }}>{u.email}</td>
                      <td style={S.td}>
                        <span style={{
                          fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                          background: u.role === 'admin' ? '#ede9fe' : u.role === 'operator' ? '#dbeafe' : '#f0fdf4',
                          color: u.role === 'admin' ? '#4c1d95' : u.role === 'operator' ? '#1e40af' : '#059669'
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ ...S.td, color: '#10b981', fontWeight: 500 }}>{u.solde} MAD</td>
                      <td style={S.td}>{orders.filter(o => o.userId === u.id).length}</td>
                      <td style={S.td}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {u.role !== 'admin' && (
                            <button onClick={() => handleRoleChange(u.id, 'admin')} style={{ ...S.btnSm, background: '#ede9fe', color: '#4c1d95' }}>→ Admin</button>
                          )}
                          {u.role !== 'operator' && (
                            <button onClick={() => handleRoleChange(u.id, 'operator')} style={{ ...S.btnSm, background: '#dbeafe', color: '#1e40af' }}>→ Opérateur</button>
                          )}
                          {u.role !== 'client' && (
                            <button onClick={() => handleRoleChange(u.id, 'client')} style={{ ...S.btnSm, background: '#f0fdf4', color: '#059669' }}>→ Client</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MACHINES */}
          {activeTab === 'machines' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
              {machines.map(m => (
                <div key={m.id} style={{
                  background: 'white', borderRadius: 14,
                  border: `1px solid ${m.status === 'error' ? '#fecaca' : '#f3f4f6'}`,
                  padding: 20
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.status === 'printing' ? '#10b981' : m.status === 'error' ? '#ef4444' : '#d1d5db' }} />
                      <span style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>{m.name}</span>
                    </div>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: m.status === 'printing' ? '#d1fae5' : m.status === 'error' ? '#fee2e2' : '#f3f4f6',
                      color: m.status === 'printing' ? '#065f46' : m.status === 'error' ? '#991b1b' : '#6b7280'
                    }}>
                      {m.status === 'printing' ? 'En cours' : m.status === 'error' ? 'Erreur' : 'Disponible'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>
                    Type : {m.type} · Matériaux : {m.materials.join(', ')}
                  </div>
                  <div style={{ background: '#f3f4f6', borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 6 }}>
                    <div style={{ height: '100%', borderRadius: 6, width: `${m.progress}%`, background: m.status === 'error' ? '#ef4444' : '#10b981' }} />
                  </div>
                  {m.status === 'printing' && (
                    <div style={{ fontSize: 12, color: '#9ca3af', textAlign: 'right' }}>{m.progress}%</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ASSIGNATION */}
          {activeTab === 'assign' && (
            <div style={S.card}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f9fafb', fontWeight: 600, fontSize: 14, color: '#111827' }}>
                Commandes à assigner
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['ID', 'Client', 'Fichier', 'Matériau', 'Prix', 'Machine', 'Action'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {orders.filter(o => o.status === 'pending').map(o => (
                    <tr key={o.id}>
                      <td style={{ ...S.td, color: '#10b981', fontWeight: 600 }}>#{o.id}</td>
                      <td style={S.td}>{getUserName(o.userId)}</td>
                      <td style={{ ...S.td, color: '#6b7280' }}>{o.fileName}</td>
                      <td style={S.td}>{o.material}</td>
                      <td style={{ ...S.td, fontWeight: 500 }}>{o.price} MAD</td>
                      <td style={S.td}>
                        {o.machineId
                          ? <span style={{ color: '#059669' }}>{machines.find(m => m.id === o.machineId)?.name}</span>
                          : <span style={{ color: '#9ca3af' }}>Non assignée</span>
                        }
                      </td>
                      <td style={S.td}>
                        <select
                          defaultValue=""
                          onChange={e => e.target.value && handleAssign(o.id, e.target.value)}
                          style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', fontSize: 12, background: 'white', cursor: 'pointer', outline: 'none' }}
                        >
                          <option value="">Choisir machine...</option>
                          {machines.filter(m => m.status === 'idle' && m.materials.includes(o.material)).map(m => (
                            <option key={m.id} value={m.id}>{m.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.filter(o => o.status === 'pending').length === 0 && (
                    <tr>
                      <td colSpan={7} style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
                        Aucune commande en attente
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>

      {/* Modal détail commande */}
      {selectedOrder && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}
          onClick={() => setSelectedOrder(null)}
        >
          <div
            style={{ background: 'white', borderRadius: 16, padding: 28, width: 420 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>Commande #{selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#9ca3af' }}>✕</button>
            </div>
            {[
              { label: 'Client',    value: getUserName(selectedOrder.userId) },
              { label: 'Fichier',   value: selectedOrder.fileName },
              { label: 'Matériau',  value: selectedOrder.material },
              { label: 'Couleur',   value: selectedOrder.color },
              { label: 'Quantité',  value: selectedOrder.quantity },
              { label: 'Prix',      value: `${selectedOrder.price} MAD` },
              { label: 'Date',      value: selectedOrder.date },
              { label: 'Notes',     value: selectedOrder.notes || '—' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6', fontSize: 13 }}>
                <span style={{ color: '#9ca3af' }}>{row.label}</span>
                <span style={{ color: '#374151', fontWeight: 500 }}>{row.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 8 }}>Changer le statut</label>
              <select
                value={selectedOrder.status}
                onChange={e => { handleStatusChange(selectedOrder.id, e.target.value); setSelectedOrder({ ...selectedOrder, status: e.target.value }) }}
                style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', fontSize: 13, outline: 'none' }}
              >
                {statusOptions.map(s => <option key={s} value={s}>{statusMap[s]?.label}</option>)}
              </select>
            </div>
            <button
              onClick={() => setSelectedOrder(null)}
              style={{ width: '100%', marginTop: 16, background: '#10b981', color: 'white', border: 'none', borderRadius: 10, padding: '11px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin