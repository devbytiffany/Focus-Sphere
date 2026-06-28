import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { apiRequest } from '../api/api'

function Settings() {
  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [statuses, setStatuses] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [priorityName, setPriorityName] = useState('')
  const [statusName, setStatusName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadAll()
  }, [])

  async function loadAll() {
    try {
      const cat = await apiRequest('/categories', 'GET', null, token)
      const pri = await apiRequest('/priorities', 'GET', null, token)
      const stat = await apiRequest('/task-status', 'GET', null, token)
      setCategories(cat.categories)
      setPriorities(pri.priorities)
      setStatuses(stat.statuses)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddCategory(e) {
    e.preventDefault()
    try {
      await apiRequest('/categories', 'POST', { name: categoryName }, token)
      setCategoryName('')
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteCategory(id) {
    try {
      await apiRequest(`/categories/${id}`, 'DELETE', null, token)
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddPriority(e) {
    e.preventDefault()
    try {
      await apiRequest('/priorities', 'POST', { name: priorityName }, token)
      setPriorityName('')
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeletePriority(id) {
    try {
      await apiRequest(`/priorities/${id}`, 'DELETE', null, token)
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddStatus(e) {
    e.preventDefault()
    try {
      await apiRequest('/task-status', 'POST', { name: statusName }, token)
      setStatusName('')
      loadAll()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <Nav />
      <h1>Settings</h1>
      {error && <p>{error}</p>}

      <h2>Categories</h2>
      <form onSubmit={handleAddCategory}>
        <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="New category" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {categories.map((c) => (
          <li key={c.id}>
            {c.name}
            <button onClick={() => handleDeleteCategory(c.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Priorities</h2>
      <form onSubmit={handleAddPriority}>
        <input value={priorityName} onChange={(e) => setPriorityName(e.target.value)} placeholder="New priority" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {priorities.map((p) => (
          <li key={p.id}>
            {p.name}
            <button onClick={() => handleDeletePriority(p.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Task Statuses</h2>
      <form onSubmit={handleAddStatus}>
        <input value={statusName} onChange={(e) => setStatusName(e.target.value)} placeholder="New status" />
        <button type="submit">Add</button>
      </form>
      <ul>
        {statuses.map((s) => (
          <li key={s.id}>{s.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Settings