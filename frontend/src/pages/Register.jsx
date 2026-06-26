import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {apiRequest} from '../api/api'

function Register(){
    const[name, setName] = useState('')
    const[email, setEmail]= useState('')
    const[password, setPassword]= useState('')
    const[error, setError]= useState('')
    const navigate= useNavigate()

    async function handleSubmit(e){
        e.preventDefault()
        console.log('Register button clicked, attempting submission...')
        setError('')

        try{
            await apiRequest('/register', 'POST', {name, email, password})
            navigate('/login')
        } catch (err){
            setError(err.message)
        }
    }

    return(
        <div>
      <h1>Create your Focus Sphere account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </div>
    )
}

export default Register