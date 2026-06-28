import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Nav from '../components/Nav'
import { apiRequest } from '../api/api'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [categories, setCategories] = useState([])
  const [priorities, setPriorities] = useState([])
  const [statuses, setStatuses] = useState([])
  const [categoryId, setCategoryId] = useState('')
  const [priorityId, setPriorityId] = useState('')
  const [statusId, setStatusId] = useState('')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadTasks()
    loadOptions()
  }, [])

  async function loadTasks() {
    try {
      const data = await apiRequest('/tasks', 'GET', null, token)
      setTasks(data.tasks)
    } catch (err) {
      setError(err.message)
    }
  }

  async function loadOptions() {
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

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await apiRequest('/tasks', 'POST', {
        title,
        category_id: categoryId || null,
        priority_id: priorityId || null,
        status_id: statusId || null
      }, token)
      setTitle('')
      setCategoryId('')
      setPriorityId('')
      setStatusId('')
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await apiRequest(`/tasks/${id}`, 'DELETE', null, token)
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdate(id) {
    try {
      await apiRequest(`/tasks/${id}`, 'PUT', { title: editTitle }, token)
      setEditingId(null)
      loadTasks()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <Nav />
      <h1>Your Tasks</h1>

      <form onSubmit={handleCreate}>
        <input
          type="text"
          placeholder="New task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">No Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <select value={priorityId} onChange={(e) => setPriorityId(e.target.value)}>
          <option value="">No Priority</option>
          {priorities.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select value={statusId} onChange={(e) => setStatusId(e.target.value)}>
          <option value="">No Status</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <button type="submit">Add Task</button>
      </form>

      {error && <p>{error}</p>}

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleUpdate(task.id)}>Save</button>
              </>
            ) : (
              <>
                {task.title}
                <button onClick={() => { setEditingId(task.id); setEditTitle(task.title) }}>Edit</button>
              </>
            )}
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Tasks