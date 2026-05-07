import { useState, useEffect } from 'react'

const API = 'http://localhost:3000'

// couleurs statiques (pas besoin d'API pour ça)
const colors = ["Blanc", "Noir", "Gris", "Bleu", "Rouge", "Vert", "Jaune"]

function Order({ user, onCreateOrder, onNavigate }) {
  const [materials, setMaterials] = useState([])
  const [fileName, setFileName] = useState('')
  const [material, setMaterial] = useState('PLA')
  const [color, setColor] = useState('Blanc')
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Charger les matériaux depuis le backend
  useEffect(() => {
    fetch(`${API}/materials`)
      .then(r => r.json())
      .then(data => {
        setMaterials(data)
        if (data.length > 0) setMaterial(data[0].name)
      })
  }, [])

  const selectedMaterial = materials.find(m => m.name === material)
  const totalPrice = selectedMaterial ? selectedMaterial.price * quantity : 0

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Seuls les fichiers .STL sont acceptés')
      return
    }
    setError('')
    setFileName(file.name)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fileName) { setError('Veuillez sélectionner un fichier STL'); return }
    if (user.solde < totalPrice) {
      setError(`Solde insuffisant ! Votre solde : ${user.solde} MAD, Prix : ${totalPrice} MAD`)
      return
    }
    setError('')
    setLoading(true)
    try {
      await onCreateOrder({ fileName, material, color, quantity, notes })
      setSuccess(true)
      setTimeout(() => onNavigate('dashboard'), 2000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 40, textAlign: 'center', border: '1px solid #f3f4f6', maxWidth: 400 }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Commande confirmée !</h2>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8 }}>Votre commande a été passée avec succès.</p>
          <p style={{ fontSize: 13, color: '#10b981', fontWeight: 500 }}>
            -{totalPrice} MAD débités · Nouveau solde : {user.solde - totalPrice} MAD
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12 }}>Redirection vers le dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'system-ui, sans-serif' }}>
      <nav style={{ background: 'white', borderBottom: '1px solid #f3f4f6', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: '#10b981', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>C</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Click2Print</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981', background: '#d1fae5', padding: '4px 12px', borderRadius: 20 }}>
            Solde : {user?.solde} MAD
          </span>
          <button onClick={() => onNavigate('dashboard')} style={{ fontSize: 13, color: '#6b7280', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}>
            ← Retour
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginBottom: 4 }}>Nouvelle commande</h1>
        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 28 }}>Configurez votre impression 3D</p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 20, border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Upload fichier */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '20px 24px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Fichier STL</h2>
            <label style={{ display: 'block', border: '2px dashed #e5e7eb', borderRadius: 12, padding: '24px', textAlign: 'center', cursor: 'pointer', background: fileName ? '#f0fdf4' : '#f9fafb', borderColor: fileName ? '#10b981' : '#e5e7eb' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📁</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                {fileName || 'Cliquez pour sélectionner un fichier STL'}
              </div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>
                {fileName ? 'Fichier sélectionné' : 'Formats acceptés : .stl'}
              </div>
              <input type="file" accept=".stl" onChange={handleFileChange} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Matériau */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '20px 24px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Matériau</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {materials.map(m => (
                <button key={m.id} type="button" onClick={() => setMaterial(m.name)} style={{ padding: '12px 8px', borderRadius: 12, border: material === m.name ? '2px solid #10b981' : '1px solid #e5e7eb', background: material === m.name ? '#d1fae5' : 'white', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#10b981', marginTop: 2 }}>{m.price} MAD</div>
                </button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '20px 24px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Couleur</h2>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {colors.map(c => (
                <button key={c} type="button" onClick={() => setColor(c)} style={{ padding: '8px 16px', borderRadius: 10, border: color === c ? '2px solid #10b981' : '1px solid #e5e7eb', background: color === c ? '#d1fae5' : 'white', color: color === c ? '#059669' : '#374151', cursor: 'pointer', fontSize: 13, fontWeight: color === c ? 600 : 400 }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantité + Notes */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '20px 24px', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 14 }}>Quantité</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', fontSize: 20, cursor: 'pointer', color: '#374151' }}>-</button>
              <span style={{ fontSize: 20, fontWeight: 600, color: '#111827', minWidth: 30, textAlign: 'center' }}>{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => q + 1)} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #e5e7eb', background: 'white', fontSize: 20, cursor: 'pointer', color: '#374151' }}>+</button>
            </div>
            <label style={{ fontSize: 13, fontWeight: 500, color: '#374151', display: 'block', marginBottom: 6 }}>Notes (optionnel)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Instructions spéciales..." rows={3} style={{ width: '100%', border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', fontSize: 13, resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
          </div>

          {/* Prix + Commander */}
          <div style={{ background: 'white', borderRadius: 14, border: '1px solid #f3f4f6', padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, color: '#6b7280' }}>Prix estimé</span>
              <span style={{ fontSize: 26, fontWeight: 700, color: '#111827' }}>{totalPrice} MAD</span>
            </div>
            <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>
              {selectedMaterial?.price} MAD × {quantity} pièce{quantity > 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 12, color: user?.solde >= totalPrice ? '#10b981' : '#ef4444', marginBottom: 16 }}>
              Votre solde : {user?.solde} MAD
              {user?.solde < totalPrice && ' — Solde insuffisant !'}
            </div>
            <button type="submit" disabled={loading || user?.solde < totalPrice} style={{ width: '100%', background: loading || user?.solde < totalPrice ? '#9ca3af' : '#10b981', color: 'white', border: 'none', borderRadius: 12, padding: '14px 0', fontSize: 15, fontWeight: 600, cursor: loading || user?.solde < totalPrice ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Commande en cours...' : `Commander pour ${totalPrice} MAD →`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Order