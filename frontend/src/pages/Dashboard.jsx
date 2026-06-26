import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../api/api'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      navigate('/login')
      return
    }

    async function loadDashboard() {
      try {
        const data = await apiRequest('/dashboard', 'GET', null, token)
        setStats(data)
      } catch (err) {
        setError(err.message)
      }
    }

    loadDashboard()
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  if (error) return <p>{error}</p>
  if (!stats) return <p>Loading dashboard...</p>

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
      <p>Total Tasks: {stats.totalTasks}</p>
      <p>Focus Time: {stats.formattedFocusTime}</p>
      <p>Upcoming Events: {stats.upcomingEvents}</p>
    </div>
  )
}

export default Dashboard