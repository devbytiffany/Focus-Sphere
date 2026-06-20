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
    jwt.verify(token, process.env.JWT_SECRET,(err, decoded)=>{
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


app.get("/profile", verifyToken,(req, res)=>{
    res.status(200).json({message:'You are authenticated!', user: req.user});
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});