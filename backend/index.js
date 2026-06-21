const express = require('express');
const dotenv = require('dotenv');
const{createClient} = require('@supabase/supabase-js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);

const app = express();
app.use(express.json());

function verifyToken(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error:'No token provided'});
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
        if(err){
            return res.status(401).json({error:'Invalid or expired token'});
        }
        req.user=decoded;
        next();
    });
}

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Focus Sphere Backend is running!');
});

//User Registration
app.post('/register', async(req, res) =>{
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({error:'Please provide name, email, password'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const {data, error} = await supabase 
        .from('users')
        .insert([{name, email, password: hashedPassword}])
        .select();
    
    if (error){
        return res.status(500).json({error:error.message});
    }

    res.status(201).json({message: 'User registered successfully', user: data[0]});
});

//User Login Route
app.post('/login', async (req, res) => {
    const{email, password}= req.body;

    if(!email|| !password){
        return res.status(400).json({error:'Please Provide email and password'});
    }

    const{data: users, error} = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (error){
        return res.status(500).json({error: error.message});
    }

    if(users.length ===0){
        return res.status(401).json({error:'Invalid email or password'})
    }

    const user= users[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch){
        return res.status(401).json({error:'Invalid email or password'});
    }

    const token =jwt.sign(
        { id: user.id, email: user.email},
        process.env.JWT_SECRET,
        {expiresIn:'7d'}
    );

    res.status(200).json({message:'Login successful', token, user: {id: user.id, name: user.name, email: user.email}});
});

//User Logout Route
app.post('/logout', verifyToken,(req, res)=>{
    res.status(200).json({message: 'Logout Successfull'});
});

app.get('/test-db', async (req, res) => {
    const{data, error} = await supabase.from('users').select('*');

    if (error){
        return res.status(500).json({error: error.message});
    }
    res.json({message: 'Database connected!', data});
});

//Tasks Route
app.post('/tasks', verifyToken, async (req, res)=>{
    const {title, description, due_date, category_id, priority_id, status_id}= req.body;
    if(!title){
        return res.status(400).json({error:'Title is required'});
    }

    const{data, error}= await supabase
        .from('tasks')
        .insert([{
            title,
            description,
            due_date,
            user_id: req.user.id,
            category_id,
            priority_id,
            status_id
        }])
        .select();
    if(error){
        return res.status(500).json({error: error.message});
    }
    res.status(201).json({message: 'Task created successfully', task: data[0]});
});

//Read Tasks
app.get('/tasks', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ tasks: data });
});

//Update Route
app.put('/tasks/:id', verifyToken, async(req, res)=>{
    const{id}= req.params;
    const{title, description, due_date, category_id, priority_id, status_id}=req.body;

    const updates ={};
    if(title !== undefined)updates.title= title;
    if (description !== undefined) updates.description = description;
    if (due_date !== undefined) updates.due_date = due_date;
    if (category_id !== undefined) updates.category_id = category_id;
    if (priority_id !== undefined) updates.priority_id = priority_id;
    if (status_id !== undefined) updates.status_id = status_id;

    const {data, error}= await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    if(data.length === 0){
        return res.status(404).json({error: 'Task not found'});
    }
    res.status(200).json({message: 'Task updated successfully', task: data[0]});
});

//Delete Route
app.delete('/tasks/:id', verifyToken, async(req,res)=>{
    const{id}= req.params;

    const{data, error} = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if(error){
        return res.status(500).json({error: error.message});
    }

    if(data.length === 0){
        return res.status(404).json({error: 'Task not found'});
    }
    res.status(200).json({message: 'Tasks deleted successfully'});
});

//Category Routes
app.post('/categories', verifyToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
        .from('category')
        .insert([{ name, user_id: req.user.id }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Category created successfully', category: data[0] });
});

app.get('/categories', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('category')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ categories: data });
});

app.put('/categories/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
        .from('category')
        .update({ name })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category updated successfully', category: data[0] });
});

app.delete('/categories/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('category')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Category not found' });
    }

    res.status(200).json({ message: 'Category deleted successfully' });
});

//Priorities Routes
app.post('/priorities', verifyToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
        .from('priorities')
        .insert([{ name, user_id: req.user.id }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Priority created successfully', priority: data[0] });
});

app.get('/priorities', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('priorities')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ priorities: data });
});

app.put('/priorities/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
        .from('priorities')
        .update({ name })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Priority not found' });
    }

    res.status(200).json({ message: 'Priority updated successfully', priority: data[0] });
});

app.delete('/priorities/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('priorities')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Priority not found' });
    }

    res.status(200).json({ message: 'Priority deleted successfully' });
});

//Task Status Routes
app.post('/task-status', verifyToken, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    const { data, error } = await supabase
        .from('task_status')
        .insert([{ name }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Status created successfully', status: data[0] });
});

app.get('/task-status', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('task_status')
        .select('*');

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ statuses: data });
});

//Events Routes
app.post('/events', verifyToken, async (req, res) => {
    const { title, description, start_time, end_time } = req.body;

    if (!title || !start_time) {
        return res.status(400).json({ error: 'Title and start_time are required' });
    }

    const { data, error } = await supabase
        .from('events')
        .insert([{ title, description, start_time, end_time, user_id: req.user.id }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Event created successfully', event: data[0] });
});

app.get('/events', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ events: data });
});

app.put('/events/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, start_time, end_time } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (description !== undefined) updates.description = description;
    if (start_time !== undefined) updates.start_time = start_time;
    if (end_time !== undefined) updates.end_time = end_time;

    const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: data[0] });
});

app.delete('/events/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
});

//Focus Sessions Routes
app.post('/focus-sessions/start', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('focus_sessions')
        .insert([{ start_time: new Date(), user_id: req.user.id }])
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ message: 'Focus session started', session: data[0] });
});

app.put('/focus-sessions/:id/stop', verifyToken, async (req, res) => {
    const { id } = req.params;

    const { data: sessions, error: fetchError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('id', id)
        .eq('user_id', req.user.id);

    if (fetchError) {
        return res.status(500).json({ error: fetchError.message });
    }

    if (sessions.length === 0) {
        return res.status(404).json({ error: 'Focus session not found' });
    }

    const session = sessions[0];
    const endTime = new Date();
    const startTime = new Date(session.start_time);
    const durationInSeconds = Math.round((endTime - startTime) / 1000);

    const { data, error } = await supabase
        .from('focus_sessions')
        .update({ end_time: endTime, duration: durationInSeconds })
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ message: 'Focus session stopped', session: data[0] });
});

app.delete('/focus-sessions/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from('focus_sessions')
        .delete()
        .eq('id', id)
        .eq('user_id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    if (data.length === 0) {
        return res.status(404).json({ error: 'Focus session not found' });
    }

    res.status(200).json({ message: 'Focus session deleted successfully' });
});

app.get('/focus-sessions', verifyToken, async (req, res) => {
    const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', req.user.id);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ sessions: data });
});

app.get("/profile", verifyToken,(req, res)=>{
    res.status(200).json({message:'You are authenticated!', user: req.user});
});

//Update Profile
app.put('/profile', verifyToken, async (req, res) => {
    const { name, email, password } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;

    if (email !== undefined) {
        const { data: existing, error: checkError } = await supabase
            .from('users')
            .select('id')
            .eq('email', email);

        if (checkError) {
            return res.status(500).json({ error: checkError.message });
        }

        if (existing.length > 0 && existing[0].id !== req.user.id) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        updates.email = email;
    }

    if (password !== undefined) {
        updates.password = await bcrypt.hash(password, 10);
    }

    const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', req.user.id)
        .select();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    const updatedUser = data[0];
    res.status(200).json({
        message: 'Profile updated successfully',
        user: { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email }
    });
});

//Change Password
app.put('/profile/change-password', verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
    }

    const { data: users, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id);

    if (fetchError) {
        return res.status(500).json({ error: fetchError.message });
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
        return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const { error: updateError } = await supabase
        .from('users')
        .update({ password: hashedNewPassword })
        .eq('id', req.user.id);

    if (updateError) {
        return res.status(500).json({ error: updateError.message });
    }

    res.status(200).json({ message: 'Password changed successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});