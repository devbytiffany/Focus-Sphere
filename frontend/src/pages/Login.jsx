import{useState} from 'react'
import{Link, useNavigate} from 'react-router-dom'
import{apiRequest} from '../api/api'

function Login(){
    const[email, setEmail] = useState('')
    const[password, setPassword]= useState('')
    const[error, setError] = useState('')
    const navigate = useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        setError('')

        try{
            const data = await apiRequest('/login', 'POST', {email, password})
            localStorage.setItem('token', data.token)
            navigate('/dashboard')
        } catch (err){
            setError(err.message)
        }
    }

    return (
    <div>
      <h1>Login to Focus Sphere</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p>{error}</p>}
        <button type="submit">Log In</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    )
}

export default Login