import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { apiRequest } from '../api/api'

function Profile() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    loadProfile()
  }, [])

  async function loadProfile() {
    try {
      const data = await apiRequest('/profile', 'GET', null, token)
      setUser(data.user)
      setName(data.user.name)
      setEmail(data.user.email)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleUpdateProfile(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      const data = await apiRequest('/profile', 'PUT', { name, email }, token)
      setUser(data.user)
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    try {
      await apiRequest('/profile/change-password', 'PUT', { currentPassword, newPassword }, token)
      setCurrentPassword('')
      setNewPassword('')
      setMessage('Password changed successfully')
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) return <div><Nav /><p>Loading profile...</p></div>

  return (
    <div>
      <Nav />
      <h1>Profile</h1>

      {error && <p>{error}</p>}
      {message && <p>{message}</p>}

      <h2>Update Info</h2>
      <form onSubmit={handleUpdateProfile}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit">Save</button>
      </form>

      <h2>Change Password</h2>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current Password"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
        />
        <button type="submit">Change Password</button>
      </form>
    </div>
  )
}

export default Profile