import { useState, useEffect} from 'react'
import { useNavigate, Link} from 'react-router-dom'
import Nav from '../components/Nav'
import {apiRequest} from '../api/api'

function Events(){
    const[events, setEvents] = useState([])
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState('')
    const[error, setError] = useState('')
    const navigate= useNavigate()
    const token = localStorage.getItem('token')
    const [editingId, setEditingId] = useState(null)
    const [editTitle, setEditTitle] = useState('')
    const [editStartTime, setEditStartTime] = useState('')

    useEffect(()=> {
        if(!token){
            navigate('/login')
            return
        }
        loadEvents()
    }, [])

    async function loadEvents(){
        try{
            const data = await apiRequest('/events', 'GET', null, token)
            setEvents(data.events)
        } catch (err){
            setError(err.message)
        }
    }

    async function handleCreate(e){
        e.preventDefault()
        try{
            await apiRequest('/events', 'POST', {title, start_time: startTime}, token)
            setTitle('')
            setStartTime('')
            loadEvents()
        } catch(err){
            setError(err.message)
        }
    }

    async function handleUpdate(id) {
        try {
            await apiRequest(`/events/${id}`, 'PUT', { title: editTitle, start_time: editStartTime }, token)
            setEditingId(null)
            loadEvents()
        } catch (err) {
            setError(err.message)
        }
    }

    async function handleDelete(id){
        try{
            await apiRequest(`/events/${id}`, 'DELETE', null, token)
            loadEvents()
        } catch (err){
            setError(err.message)
        }
    }

    return (
        <div>
            <Nav/>
            <h1>Your Events</h1>
            <Link to ="/dashboard">Back to Dashboard</Link>

            <form onSubmit={handleCreate}>
                <input type ="text" placeholder="Event Title" value={title} onChange={(e)=> setTitle(e.target.value)}/>

                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)}/>
                <button type="submit"> Add Event</button>
            </form>

            {error &&<p>{error}</p>}

        <ul>
            {events.map((event) => (
                <li key={event.id}>
                {editingId === event.id ? (
                    <>
                    <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    <input
                        type="datetime-local"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                    />
                    <button onClick={() => handleUpdate(event.id)}>Save</button>
                    </>
                ) : (
                    <>
                    {event.title} — {new Date(event.start_time).toLocaleString()}
                    <button onClick={() => { setEditingId(event.id); setEditTitle(event.title); setEditStartTime(event.start_time) }}>Edit</button>
                    </>
                )}
                <button onClick={() => handleDelete(event.id)}>Delete</button>
                </li>
            ))}
        </ul>

        </div>
    )
}

export default Events