import{useState, useEffect} from 'react'
import{ useNavigate, Link} from 'react-router-dom'
import {apiRequest} from '../api/api'

function Tasks(){
    const [tasks, setTasks]= useState([])
    const [title, setTitle]= useState('')
    const [error, setError]= useState('')
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    useEffect(()=>{
        if(!token){
            navigate('/login')
            return
        }
        loadTasks()
    }, [])

    async function loadTasks(){
        try{
            const data= await apiRequest('/tasks', 'GET', null, token)
            setTasks(data.tasks)
        } catch (err){
            setError(err.message)
        }
    }

    async function handleCreate(e){
        e.preventDefault()
        try{
            await apiRequest('/tasks', 'POST', {title}, token)
            setTitle('')
            loadTasks()
        } catch (err){
            setError(err.message)
        }
    }

    async function handleDelete(){
        try{
            await apiRequest(`/tasks/${id}`, 'DELETE', null, token)
            loadTasks()
        } catch (err){
            setError(err.message)
        }
    }

    return(
        <div>
            <h1>Your Tasks</h1>
            <Link to ='/dashboard'>Back to Dashboard</Link>

            <form onSubmit={handleCreate}>
                <input type ='text' placeholder='New task title' value={title} onChange={(e) => setTitle(e.target.value)}/>
                <button type='submit'>Add Task</button>
            </form>

            {error && <p>{error}</p>}

            <ul>
                {tasks.map((task)=>(
                    <li key={task.id}>{task.title} <button onClick={()=> handleDelete (task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default Tasks