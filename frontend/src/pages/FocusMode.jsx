import {useState, useEffect, useRef} from 'react'
import {useNavigate, Link} from 'react-router-dom'
import {apiRequest} from '../api/api'

function FocusMode(){
    const [sessionId, setSessionId] = useState(null)
    const[seconds, setSeconds] = useState (0)
    const [isRunning, setIsRunning] = useState(false)
    const [error, setError]= useState('')
    const navigate= useNavigate()
    const token = localStorage.getItem('token')
    const intervalRef = useRef(null)

    useEffect (()=>{
        if(!token){
            navigate('/login')
        }
    }, [])

    useEffect(() =>{
        if (isRunning){
            intervalRef.current = setInterval(()=>{
                setSeconds((prev) => prev +1)
            }, 1000)
        }
        return ()=> clearInterval(intervalRef.current)
    }, [isRunning])


  async function handleStart() {
    try {
      const data = await apiRequest('/focus-sessions/start', 'POST', null, token)
      setSessionId(data.session.id)
      setSeconds(0)
      setIsRunning(true)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleStop() {
    try {
      await apiRequest(`/focus-sessions/${sessionId}/stop`, 'PUT', null, token)
      setIsRunning(false)
      setSessionId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div>
      <h1>Focus Mode</h1>
      <Link to="/dashboard">Back to Dashboard</Link>

      <h2>{formatTime(seconds)}</h2>

      {error && <p>{error}</p>}

      {!isRunning ? (
        <button onClick={handleStart}>Start Focus Session</button>
      ) : (
        <button onClick={handleStop}>Stop</button>
      )}
    </div>
  )
}

export default FocusMode
