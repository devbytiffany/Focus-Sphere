import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Events from './pages/Events'
import FocusMode from './pages/FocusMode'
import './App.css'

function App(){
  return(
    <Routes>
      <Route path="Login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/events" element={<Events />} />
      <Route path="/focus" element={<FocusMode />} />
    </Routes>
  )
}

export default App