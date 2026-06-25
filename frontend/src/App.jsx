import{useState} from 'react'
import {useEffect} from 'react'
import './App.css'
import loadingImg from './assets/react.svg'

function App(){
  const [isLoading, setIsLoading] = useState(true)
  useEffect(()=>{
    setTimeout(()=>{
      setIsLoading(false)
    }, 2000)
  },[])
  return(
    <div className="app-container">
      {isLoading ? <h5><img src={loadingImg} alt= 'Loading...'/></h5> : <h2>Welcome to Focus-Sphere</h2>}
    </div>
  )
}

export default App;
