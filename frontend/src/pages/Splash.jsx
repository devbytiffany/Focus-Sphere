import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Splash() {
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const token = localStorage.getItem('token')
      navigate(token ? '/dashboard' : '/login')
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-container" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="timer-circle" style={{ width: '120px', height: '120px' }}>
        <h2 style={{ margin: 0 }}>Focus Sphere</h2>
      </div>
    </div>
  )
}

export default Splash