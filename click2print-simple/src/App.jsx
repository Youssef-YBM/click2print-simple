import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import Order from './pages/Order'

// URL du backend NestJS
const API = 'http://localhost:3000'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [usersList, setUsersList] = useState([])
  const [machinesList, setMachinesList] = useState([])
  const [materials, setMaterials] = useState([])
  const [page, setPage] = useState('login')

  // Charger machines et matériaux au démarrage
  useEffect(() => {
    fetch(`${API}/machines`).then(r => r.json()).then(setMachinesList)
  }, [])

  // Charger les commandes quand l'user change
  useEffect(() => {
    if (!currentUser) return
    if (currentUser.role === 'admin' || currentUser.role === 'operator') {
      fetch(`${API}/orders`).then(r => r.json()).then(setOrders)
      fetch(`${API}/users`).then(r => r.json()).then(setUsersList)
    } else {
      fetch(`${API}/orders?userId=${currentUser.id}`).then(r => r.json()).then(setOrders)
    }
  }, [currentUser])

  // Connexion → POST /users/login
  const handleLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      fetch(`${API}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then(async res => {
          if (!res.ok) {
            const err = await res.json()
            reject(new Error(err.message || 'Email ou mot de passe incorrect'))
            return
          }
          const user = await res.json()
          setCurrentUser(user)
          setPage(user.role === 'client' ? 'dashboard' : 'admin')
          resolve(user)
        })
        .catch(() => reject(new Error('Erreur de connexion au serveur')))
    })
  }

  // Déconnexion
  const handleLogout = () => {
    setCurrentUser(null)
    setOrders([])
    setPage('login')
  }

  // Créer une commande → POST /orders
  const handleCreateOrder = (orderData) => {
    return new Promise((resolve, reject) => {
      fetch(`${API}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderData, userId: currentUser.id }),
      })
        .then(async res => {
          if (!res.ok) {
            const err = await res.json()
            reject(new Error(err.message || 'Erreur lors de la commande'))
            return
          }
          const newOrder = await res.json()
          setOrders(prev => [newOrder, ...prev])
          // Mettre à jour le solde affiché
          const updatedSolde = currentUser.solde - newOrder.price
          setCurrentUser(prev => ({ ...prev, solde: updatedSolde }))
          resolve(newOrder)
        })
        .catch(() => reject(new Error('Erreur de connexion au serveur')))
    })
  }

  // Changer statut → PUT /orders/:id/status
  const handleUpdateStatus = (orderId, status) => {
    fetch(`${API}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
      .then(r => r.json())
      .then(updated => {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
      })
  }

  // Assigner machine → PUT /orders/:id/assign
  const handleAssignMachine = (orderId, machineId) => {
    fetch(`${API}/orders/${orderId}/assign`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machineId }),
    })
      .then(r => r.json())
      .then(updated => {
        setOrders(prev => prev.map(o => o.id === orderId ? updated : o))
        setMachinesList(prev => prev.map(m =>
          m.id === machineId ? { ...m, status: 'printing' } : m
        ))
      })
  }

  // Changer rôle → PUT /users/:id/role
  const handleUpdateRole = (userId, role) => {
    fetch(`${API}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
      .then(r => r.json())
      .then(updated => {
        setUsersList(prev => prev.map(u => u.id === userId ? updated : u))
      })
  }

  // Recharger solde → PUT /users/:id/solde
  const handleRecharger = (montant) => {
    return new Promise((resolve, reject) => {
      fetch(`${API}/users/${currentUser.id}/solde`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ montant }),
      })
        .then(async res => {
          if (!res.ok) { reject(new Error('Erreur rechargement')); return }
          const updated = await res.json()
          setCurrentUser(prev => ({ ...prev, solde: updated.solde }))
          resolve(updated)
        })
        .catch(() => reject(new Error('Erreur de connexion au serveur')))
    })
  }

  return (
    <div>
      {page === 'login' && (
        <Login onLogin={handleLogin} />
      )}
      {page === 'dashboard' && (
        <Dashboard
          user={currentUser}
          orders={orders}
          onLogout={handleLogout}
          onNavigate={setPage}
          onRecharger={handleRecharger}
        />
      )}
      {page === 'order' && (
        <Order
          user={currentUser}
          onCreateOrder={handleCreateOrder}
          onNavigate={setPage}
        />
      )}
      {page === 'admin' && (
        <Admin
          user={currentUser}
          orders={orders}
          users={usersList}
          machines={machinesList}
          onLogout={handleLogout}
          onUpdateStatus={handleUpdateStatus}
          onAssignMachine={handleAssignMachine}
          onUpdateRole={handleUpdateRole}
          onNavigate={setPage}
        />
      )}
    </div>
  )
}

export default App