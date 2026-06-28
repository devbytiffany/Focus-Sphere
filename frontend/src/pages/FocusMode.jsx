import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { apiRequest } from '../api/api'

function FocusMode() {
  const [sessionId, setSessionId] = useState(null)
  const [durationMinutes, setDurationMinutes] = useState(25)
  const [remainingMs, setRemainingMs] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const intervalRef = useRef(null)
  const endTimeRef = useRef(null)
  const totalMsRef = useRef(0)

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const left = endTimeRef.current - Date.now()
        if (left <= 0) {
          setRemainingMs(0)
          handleStop()
        } else {
          setRemainingMs(left)
        }
      }, 31)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning])

  async function handleStart() {
    try {
      const data = await apiRequest('/focus-sessions/start', 'POST', null, token)
      setSessionId(data.session.id)

      const totalMs = durationMinutes * 60 * 1000
      totalMsRef.current = totalMs
      endTimeRef.current = Date.now() + totalMs
      setRemainingMs(totalMs)
      setIsRunning(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStop() {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    try {
      if (sessionId) {
        await apiRequest(`/focus-sessions/${sessionId}/stop`, 'PUT', null, token)
      }
      setSessionId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function formatTime(ms) {
    const totalCentiseconds = Math.floor(ms / 10)
    const mins = Math.floor(totalCentiseconds / 6000)
    const secs = Math.floor((totalCentiseconds % 6000) / 100)
    const centis = totalCentiseconds % 100
    return `${mins}:${secs < 10 ? '0' : ''}${secs}.${centis < 10 ? '0' : ''}${centis}`
  }

  const circumference = 2 * Math.PI * 90
  const progress = totalMsRef.current > 0 ? remainingMs / totalMsRef.current : 0
  const offset = circumference - progress * circumference

  return (
    <div>
      <Nav />
      <div className="page-content">
        <h1>Focus Mode</h1>

        <div className="timer-circle">
          <svg width="220" height="220" viewBox="0 0 200 200">
            <circle className="timer-track" cx="100" cy="100" r="90" />
            <circle
              className="timer-progress"
              cx="100"
              cy="100"
              r="90"
              style={{ strokeDasharray: circumference, strokeDashoffset: offset }}
            />
          </svg>
          <div className="timer-label">{formatTime(remainingMs)}</div>
        </div>

        {error && <p>{error}</p>}

        {!isRunning ? (
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label>Minutes:</label>
            <input
              type="number"
              min="1"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              style={{ width: '70px' }}
            />
            <button onClick={handleStart}>Start Focus Session</button>
          </div>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
      </div>
    </div>
  )
}

export default FocusMode