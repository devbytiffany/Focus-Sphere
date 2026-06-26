import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function App(){
  return(
    <Routes>
      <Route path="Login" element={<Login/>}/>
      <Route path="register" element={<Register/>}/>
      <Route path="/" element={<Login/>}/>
    </Routes>
  )
}

export default App