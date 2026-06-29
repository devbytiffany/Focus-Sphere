import {Routes, Route} from 'react-router-dom'
import Splash from './pages/Splash'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Events from './pages/Events'
import FocusMode from './pages/FocusMode'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import './App.css'

function App(){
  return(
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="Login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/events" element={<Events />} />
      <Route path="/focus" element={<FocusMode />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}

export default App